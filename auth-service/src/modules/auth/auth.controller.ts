import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ClientKafka, GrpcMethod } from '@nestjs/microservices';
import { KAFKA_REGISTER_USER_TOPIC } from 'src/common/const/kafka,contant';

@Controller()
export class AuthController  {
    constructor(private readonly authService: AuthService,
    ) {}

    

    @GrpcMethod('AuthGRPC', 'Register')
    async register(data: RegisterRequest) {
        const r = await this.authService.register(data);
        return r;
    }

    @GrpcMethod('AuthGRPC', 'Login')
    async login(data: LoginRequest) {
        const r = await this.authService.login(
            data.email,
            data.password,
        );
        return r;
    }

}
