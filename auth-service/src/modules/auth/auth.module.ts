import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthAccount, AuthAccountSchema } from './entities/auth-account.entity';
import { AuthAccountRepository } from './repositories/auth-account.repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: AuthAccount.name,
                schema: AuthAccountSchema,
                collection: 'auth-accounts',
                discriminators: [],
            },
        ]),
        JwtModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, AuthAccountRepository],
})
export class AuthModule {}
