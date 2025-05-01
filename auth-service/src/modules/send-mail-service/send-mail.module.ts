import { Module } from '@nestjs/common';
import { SendMailService } from './send-mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        MailerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                transport: {
                    host: 'smtp.gmail.com', // SMTP Server (Ví dụ: Gmail)
                    port: 587,
                    secure: false, // false cho STARTTLS, true cho SSL
                    auth: {
                        user: 'ktrandang291@gmail.com', // Email của bạn
                        // pass: 'dpsq vacb vsbv anqg', // Mật khẩu ứng dụng (App Password)
                        pass: configService.get<string>(
                            'GOOGLE_EMAILL_APP_PASSWORD',
                        ),
                    },
                },
                defaults: {
                    from: '"No Reply" <noreply@example.com>',
                },
            }),
        }),
    ],
    providers: [SendMailService],
    exports: [SendMailService],
})
export class SendMailModule {}
