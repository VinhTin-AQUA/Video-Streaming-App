import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { confirmAccountContent } from './content/confirm-account';

@Injectable()
export class SendMailService {
    constructor(private readonly mailerService: MailerService) {}

    async sendMail(to: string, subject: string, content: string) {
        try {
            await this.mailerService.sendMail({
                to,
                subject,
                text: content, // Nội dung email dạng text
                html: `<p>${content}</p>`, // Nội dung email dạng HTML
            });
            return true;
        } catch (error) {
            return false;
            // throw new Error(`Failed to send email: ${error.message}`);
        }
    }

    async sendEmailConfirmAccount(to: string, fullName: string, url: string) {
        try {
            const content = confirmAccountContent(
                fullName,
                url,
            );
            const subject = 'Confirm your Account';
            await this.mailerService.sendMail({
                to,
                subject,
                // text: content, // Nội dung email dạng text
                html: content, // Nội dung email dạng HTML
            });
            return true;
        } catch (error) {
            return false;
            // throw new Error(`Failed to send email: ${error.message}`);
        }
    }
}
