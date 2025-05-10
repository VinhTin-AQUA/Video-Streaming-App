import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';

@Injectable()
export class ExternalMinioService {
    private minioClient: Client;

    constructor(private configService: ConfigService) {
        this.minioClient = new Client({
            endPoint: this.configService.get<string>(
                'EXTERNAL_MINIO_ENDPOINT',
                'localhost',
            ),
            port: Number.parseInt(
                this.configService.get<string>('EXTERNAL_MINIO_PORT', '9000'),
            ),
            useSSL:
                this.configService.get<string>('MINIO_PROTOCOL') === 'https',
            accessKey: this.configService.get<string>('MINIO_ACCESSKEY'),
            secretKey: this.configService.get<string>('MINIO_SECRETKEY'),
        });
    }

    async genGetPresignedUrl(bucketName: string, objectName: string) {
        const presignedUrl = await this.minioClient.presignedUrl(
            'get',
            bucketName,
            objectName,
            3600,
        );
        return presignedUrl;
    }

    async getPutPresignedUrl(bucketName: string, objectName: string) {
        const presignedUrl = await this.minioClient.presignedUrl(
            'put',
            bucketName,
            objectName,
            3600,
        );
        return presignedUrl;
    }
}
