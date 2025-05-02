import { Injectable } from '@nestjs/common';
import { AuthAccountRepository } from './repositories/auth-account.repository';
import { AuthAccount } from './entities/auth-account.entity';
import { RpcException } from '@nestjs/microservices';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { GrpcStatusCode } from 'src/common/exceptions/rpc-status-code';
import { SendMailService } from '../send-mail-service/send-mail.service';
import { KafkaProducerService } from '../kafka/kafka-producer.service';
import { KAFKA_REGISTER_USER_TOPIC } from 'src/common/const/kafka,contant';
import { Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
    constructor(
        private readonly authAccountRepo: AuthAccountRepository,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly sendMailService: SendMailService,
        private readonly kafkaProducerService: KafkaProducerService,
    ) {}

    async register(model: RegisterRequest): Promise<RegisterResponse> {
        const accountExists = await this.authAccountRepo.findOne({
            email: model.email,
        });

        if (accountExists) {
            throw new RpcException({
                code: GrpcStatusCode.INVALID_ARGUMENT,
                message:
                    'Email này đã được đăng ký account. Vui lòng sử dụng email khác.',
            });
        }

        const account: Omit<AuthAccount, '_id'> = {
            email: model.email,
            password: await hash(model.password, 10),
        };

        const r = await this.authAccountRepo.add(account);
        if (!r) {
            throw new RpcException({
                code: 3,
                message: 'Đăng ký thất bại. Vui lòng thử lại',
                error: '',
            });
        }

        try {
            const userProfileResult =
                await this.kafkaProducerService.sendMessageWithResponse(
                    KAFKA_REGISTER_USER_TOPIC,
                    {
                        id: r._id.toString(),
                        ...model,
                    },
                );

            if (userProfileResult.isSuccess === false) {
                // roll back register
                await this.removeAccount(r._id);

                throw new RpcException({
                    code: GrpcStatusCode.INVALID_ARGUMENT,
                    message:
                        'Email này đã được đăng ký user. Vui lòng sử dụng email khác.',
                });
            }
        } catch {
            // roll back register
            await this.removeAccount(r._id);

            throw new RpcException({
                code: GrpcStatusCode.INVALID_ARGUMENT,
                message:
                    'Email này đã được đăng ký user. Vui lòng sử dụng email khác.',
            });
        }

        await this.sendMailService.sendEmailConfirmAccount(
            account.email,
            model.fullName,
            model.email,
        );

        return {
            message: 'Đăng ký thành công',
        };
    }

    async login(email: string, password: string): Promise<LoginResponse> {
        const account = await this.authAccountRepo.findOne({
            email: email,
        });

        if (!account) {
            throw new RpcException({
                code: GrpcStatusCode.INVALID_ARGUMENT,
                message: 'Tài khoản hoặc mật khẩu không chính xác',
                error: '',
            });
        }

        const authenticated = await compare(password, account.password);
        if (!authenticated) {
            throw new RpcException({
                code: GrpcStatusCode.INVALID_ARGUMENT,
                message: 'Tài khoản hoặc mật khẩu không chính xác',
                error: '',
            });
        }

        const payload = {
            id: account._id,
            email: account.email,
            jti: uuidv4(),
            iss: this.configService.get<string>('JWT_ISSUER'),
            aud: this.configService.get<string>('JWT_VALIDAUDIENCE'),
        };

        const token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
            expiresIn:
                this.configService.get<string>(
                    'JWT_ACCESS_TOKEN_EXPIRE_MINUTES',
                ) + 'm',
        });

        return {
            jwt: token,
            message: 'Đăng nhập thành công',
        };
    }

    async removeAccount(id: Types.ObjectId) {
        const r = await this.authAccountRepo.findOneAndDelete({
            _id: id,
        });
    }
}
