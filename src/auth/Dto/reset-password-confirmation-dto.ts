import { IS_EMAIL, IsEmail, IsNotEmpty, IsNumber } from "class-validator"

export class ResetPasswordConfirmationDTO{
    @IsEmail()
    readonly email:string
    @IsNotEmpty()
    readonly code:string
    @IsNotEmpty()
    readonly password:string
}