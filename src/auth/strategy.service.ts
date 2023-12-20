import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

type Payload={
    sub:number
    email:string
}


@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy){
    constructor(
        private readonly configService:ConfigService,
        private readonly prismaService:PrismaService
    ){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey:configService.get('SECRET_KEY'),
            ignoreExpiration:false
        })
    }

    async validate(payload:Payload){
        const user=await this.prismaService.user.findUnique({where:{email:payload.email}});
        if(!user) throw new UnauthorizedException("Unauthorized")
        Reflect.deleteProperty(user,'password');
        return user; 
    }
}