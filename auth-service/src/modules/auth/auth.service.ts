import { Injectable } from '@nestjs/common';
import { AuthAccountRepository } from './repositories/auth-account.repository';
import { AuthAccount } from './entities/auth-account.entity';
import { RpcException } from '@nestjs/microservices';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private readonly authAccountRepository: AuthAccountRepository,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async register(model: RegisterRequest): Promise<RegisterResponse> {
        const account: Omit<AuthAccount, '_id'> = {
            email: model.email,
            password: await hash(model.password, 10),
        };

        const r = await this.authAccountRepository.register(account);
        if (!r) {
            throw new RpcException({
                code: 3,
                message: 'Đăng ký thất bại. Vui lòng thử lại',
                error: '',
            });
        }
        return {
            message: 'Đăng ký thành công',
        };
    }

    async login(email: string, password: string): Promise<LoginResponse> {
        const account = await this.authAccountRepository.findOneByQuery({
            email: email,
        });

        if (!account) {
            throw new RpcException({
                code: 16,
                message: 'Tài khoản hoặc mật khẩu không chính xác',
                error: '',
            });
        }

        const authenticated = await compare(password, account.password);
        if (!authenticated) {
            throw new RpcException({
                code: 16,
                message: 'Tài khoản hoặc mật khẩu không chính xác',
                error: '',
            });
        }

        const payload = {
            id: account._id,
            email: account.email,
        };

        const token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
            expiresIn:
                this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRE_MINUTES') + 'm',
        });

        return {
            jwt: token,
            message: 'Đăng nhập thành công',
        };
    }
}
