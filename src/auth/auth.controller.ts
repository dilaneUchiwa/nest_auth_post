import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { signUpDto } from './Dto/signup-dto';
import { AuthService } from './auth.service';
import { signInDto } from './Dto/signin-dto';
import { ResetPasswordDTO } from './Dto/reset-password-dto';
import { ResetPasswordConfirmationDTO } from './Dto/reset-password-confirmation-dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { DeleteAccountDto } from './Dto/delete-account-dto';

@Controller('auth')
export class AuthController {
    constructor( private readonly authService:AuthService){}
    @Post('signUp')
    signUp(@Body() signUpDto:signUpDto){
        return this.authService.signUp(signUpDto);
    }
    @Post('signIn')
    signIn(@Body() signInDto:signInDto){
        return this.authService.signIn(signInDto);
    }
    @Post('reset-password')
    resetPassword(@Body() resetPasswordDto:ResetPasswordDTO){
        return this.authService.resetPassword(resetPasswordDto);
    }
    @Post('reset-password-confirmation')
    resetPasswordConfirmation(@Body() resetPasswordConfirmationDTO:ResetPasswordConfirmationDTO ){
        return this.authService.resetPasswordConfirmation(resetPasswordConfirmationDTO);
    }
    @UseGuards(AuthGuard("jwt"))
    @Delete('delete')
    deleteAccount(@Req() request:Request,@Body() deleteACcountDto:DeleteAccountDto){
        return this.authService.deleteAccount(request.user["userId"],deleteACcountDto);
    }
}

