import { Body, Controller, Post } from '@nestjs/common';
import { signUpDto } from './Dto/signup-dto';
import { AuthService } from './auth.service';
import { signInDto } from './Dto/signin-dto';

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
}
