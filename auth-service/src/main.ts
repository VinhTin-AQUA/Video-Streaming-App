import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { GrpcExceptionInterceptor } from './common/interceptors/rpc-exception.interceptor';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const appContext = await NestFactory.createApplicationContext(AppModule);
    const configService = appContext.get(ConfigService);

    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
            transport: Transport.GRPC,

            options: {
                package: 'auth',
                protoPath: join(__dirname, './protos/auth.proto'),
                url: '0.0.0.0:3001',
            },
        },
    );

    const kafkaMicroservice =
        await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
            transport: Transport.KAFKA,
            options: {
                client: {
                    brokers: [
                        configService.get<string>(
                            'KAFKA_URI',
                            'localhost:9092',
                        ),
                    ],
                },
                consumer: {
                    groupId: 'auth-consumer'
                }
            },
        });

    app.useGlobalInterceptors(new GrpcExceptionInterceptor());

    await app.listen();
    await kafkaMicroservice.listen();
    console.log('Auth Service is running, port: 3001');
}
bootstrap();
