import { Module } from '@nestjs/common';
import { VideoMetadataService } from './video-metadata.service';
import { VideoMetadataController } from './video-metadata.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
    VideoMetadata,
    VideoMetadataSchema,
} from './entities/video-metadata.entity';
import { VideoMetadataRepository } from './repositories/video-metadata.repository';
import { MinioModule } from '../minio/minio.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: VideoMetadata.name,
                schema: VideoMetadataSchema,
                collection: 'video-metadata',
                discriminators: [],
            },
        ]),
        MinioModule,
    ],
    providers: [VideoMetadataService, VideoMetadataRepository],
    controllers: [VideoMetadataController],
})
export class VideoMetadataModule {}
