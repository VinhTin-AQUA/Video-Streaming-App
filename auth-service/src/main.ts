import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { GrpcExceptionInterceptor } from './common/interceptors/rpc-exception.interceptor';

async function bootstrap() {
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
    app.useGlobalInterceptors(new GrpcExceptionInterceptor());

    await app.listen();
    console.log('Product Service is running, port: 3001');
}
bootstrap();
