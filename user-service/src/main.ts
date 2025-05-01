import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const appContext = await NestFactory.createApplicationContext(AppModule);
    const configService = appContext.get(ConfigService);

    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
            transport: Transport.GRPC,
            options: {
                package: 'user',
                protoPath: join(__dirname, './protos/user.proto'),
                url: '0.0.0.0:3003', // Port mà service sẽ lắng nghe
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
                    groupId: 'user-management-consumer', 
                },
            },
        });

    await app.listen();
    await kafkaMicroservice.listen();
    console.log('Product Service is running port: 3003');
}
bootstrap();
