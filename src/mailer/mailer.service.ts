import { Injectable } from '@nestjs/common';
import * as nodeMailer from 'nodemailer';
@Injectable()
export class MailerService {
    private async transporter(){
        const testAccount=await nodeMailer.createTestAccount();
        const transport = nodeMailer.createTransport({
            host:'localhost',
            port:1025,
            ignoreTLS:true,
            auth:{
                user:testAccount.user,
                pass:testAccount.pass
            }
        });    

        return transport;
    }

    async sendSignUpConfirmation(userEmail:string){
        (await this.transporter()).sendMail({
            from:"app@localhost.com",
            to:userEmail,
            subject:'Inscription',
            html: '<h3>confirmation subscription</h3>'
        })
    }
    async sendResetPassword(userEmail:string,url:string,code:string) {
        (await this.transporter()).sendMail({
            from:"app@localhost.com",
            to:userEmail,
            subject:'ResetEmail',
            html: `
                <a href=${url}>Reset Password</a>
                <p>Secret code <strong>${code}</strong></p>
                <p>code will expire in 15 minutes </ 
            `
        })
    }
}
