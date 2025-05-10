import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';

@Injectable()
export class InternalMinioService {
    private minioClient: Client;

    constructor(private configService: ConfigService) {
        this.minioClient = new Client({
            endPoint: this.configService.get<string>('INTERNAL_MINIO_ENDPOINT', 'localhost'),
            port: Number.parseInt(
                this.configService.get<string>('INTERNAL_MINIO_PORT', '9000'),
            ),
            useSSL:
                this.configService.get<string>('MINIO_PROTOCOL') === 'https',
            accessKey: this.configService.get<string>('MINIO_ACCESSKEY'),
            secretKey: this.configService.get<string>('MINIO_SECRETKEY'),
        });
    }

   
}
