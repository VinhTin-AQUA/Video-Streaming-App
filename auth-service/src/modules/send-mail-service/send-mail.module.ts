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
                    host: configService.get<string>('EMAIL_HOST', ''), // SMTP Server (Ví dụ: Gmail)
                    port: configService.get<number>('EMAIL_PORT', 0),
                    secure: false, // false cho STARTTLS, true cho SSL
                    auth: {
                        user: configService.get<string>('EMAIL_ADDRESS', ''), // Email của bạn
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
