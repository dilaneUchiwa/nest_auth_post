import { IsEmail, IsNotEmpty } from "class-validator"

export class signInDto{
    @IsEmail()
    readonly email:string
    @IsNotEmpty()
    readonly password:string
}