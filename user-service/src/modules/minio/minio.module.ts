import { Module } from '@nestjs/common';
import { ExternalMinioService } from './external-minio.service';
import { InternalMinioService } from './internal-minio.service';


@Module({
    providers: [InternalMinioService, ExternalMinioService],
    exports: [InternalMinioService, ExternalMinioService],
})
export class MinioModule {}
