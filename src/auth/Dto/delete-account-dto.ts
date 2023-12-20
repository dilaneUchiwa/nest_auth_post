import { IsNotEmpty } from "class-validator";

export class DeleteAccountDto{
    @IsNotEmpty()
    readonly password:string
}