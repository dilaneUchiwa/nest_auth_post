import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { signUpDto } from './Dto/signup-dto';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from 'src/mailer/mailer.service';
import { signInDto } from './Dto/signin-dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordDTO } from './Dto/reset-password-dto';
import { ResetPasswordConfirmationDTO } from './Dto/reset-password-confirmation-dto';

@Injectable()
export class AuthService {
    constructor(private readonly prismaService:PrismaService,
                private readonly mailerService:MailerService,
                private readonly jwtService:JwtService,
                private readonly configService:ConfigService
    ){}

    async signUp(signUpDto:signUpDto){
        const {username,email,password}=signUpDto;

        const user=await this.prismaService.user.findUnique({where:{email}});
        if(user) throw new ConflictException("User already exists");
        const hash = await bcrypt.hash(password,10);
        await this.prismaService.user.create({
            data:{
                username,
                email,
                password:hash
            }
        });

        await this.mailerService.sendSignUpConfirmation(email);
        return {data:"User succesfully created"} 
    }

    async signIn(signInDto:signInDto){
        const {email,password}=signInDto;

        const user=await this.prismaService.user.findUnique({where:{email}});
        if(!user) throw new NotFoundException();

        const match=await bcrypt.compare(password,user.password);
        if(!match) throw new UnauthorizedException("Password does not match");
        const payload = {
            sub:user.userId,
            email:user.email
        }
        const token=await this.jwtService.sign(payload,{expiresIn:'2h',secret:this.configService.get('SECRET_KEY')})

        return {
            token,
            user:{
                usename:user.username,
                email:user.email
            }
        }
        
    }
    async resetPassword(resetPasswordDto: ResetPasswordDTO) {
        const {email} =resetPasswordDto

        const user=await this.prismaService.user.findUnique({where:{email}});
        if(!user) throw new NotFoundException('User does not exist');
        const code=await speakeasy.totp({
            secret:this.configService.get('OTP_CODE'),
            digits:5,
            step:15*60,
            encoding:"base32"
        });

        const url="http://localhost:3000/auth/password-reset-confirmation";
        await this.mailerService.sendResetPassword(email,url,code);
        return {data:"reset password mail has been send"}
    }

    async resetPasswordConfirmation(resetPasswordConfirmationDTO: ResetPasswordConfirmationDTO) {
        const {email,password,code} =resetPasswordConfirmationDTO

        const user=await this.prismaService.user.findUnique({where:{email}});
        if(!user) throw new NotFoundException('User does not exist');
        const match=speakeasy.totp.verify({
            secret:this.configService.get('OTP_CODE'),
            token:code,
            digits:5,
            step:15*60,
            encoding:"base32"
        });

        if(!match) throw new UnauthorizedException('Invalid/Expired token');
        const hash=await bcrypt.hash(password,10);
        await this.prismaService.user.update({where:{email},data:{password:hash}})

        return {data:'password updated'};
        
    }

}
