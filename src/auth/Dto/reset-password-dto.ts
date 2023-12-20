import { IsEmail } from    "class-validator";

export class ResetPasswordDTO{
    @IsEmail()
    readonly email:string
}