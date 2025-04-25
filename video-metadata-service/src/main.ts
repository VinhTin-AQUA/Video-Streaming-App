import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { GrpcExceptionInterceptor } from './common/interceptors/grpc-exception.inerceptor';

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
            transport: Transport.GRPC,
            options: {
                package: 'videometadata',
                protoPath: join(__dirname, './protos/video-metadata.proto'),
                url: '0.0.0.0:3002', // Port mà service sẽ lắng nghe
            },
        },
    );

    app.useGlobalInterceptors(new GrpcExceptionInterceptor())
    await app.listen();
    console.log('Product Service is running..., port: 3002');
}
bootstrap();
