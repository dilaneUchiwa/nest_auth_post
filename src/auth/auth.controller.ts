import { Body, Controller, Post } from '@nestjs/common';
import { signUpDto } from './Dto/signup-dto';
import { AuthService } from './auth.service';
import { signInDto } from './Dto/signin-dto';
import { ResetPasswordDTO } from './Dto/reset-password-dto';
import { ResetPasswordConfirmationDTO } from './Dto/reset-password-confirmation-dto';

@Controller('auth')
export class AuthController {
    constructor( private readonly authService:AuthService){}
    @Post('/signUp')
    signUp(@Body() signUpDto:signUpDto){
        return this.authService.signUp(signUpDto);
    }
    @Post('/signIn')
    signIn(@Body() signInDto:signInDto){
        return this.authService.signIn(signInDto);
    }
    @Post('/reset-password')
    resetPassword(@Body() resetPasswordDto:ResetPasswordDTO){
        return this.authService.resetPassword(resetPasswordDto);
    }
    @Post('/reset-password-confirmation')
    resetPasswordConfirmation(@Body() resetPasswordConfirmationDTO:ResetPasswordConfirmationDTO ){
        return this.authService.resetPasswordConfirmation(resetPasswordConfirmationDTO);
    }
}
