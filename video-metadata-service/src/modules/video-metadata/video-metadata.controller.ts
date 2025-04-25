import { Controller } from '@nestjs/common';
import { VideoMetadataService } from './video-metadata.service';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('video-metadata')
export class VideoMetadataController {
    constructor(private readonly videoMetadataService: VideoMetadataService) {}

    @GrpcMethod('VideoMetadataGRPC', 'AddVideoMetadata')
    async addVideoMetadata(model: AddVideoMetadataRequest) {
        const r = await this.videoMetadataService.addVideoMetadata(model);
        return r;
    }

    @GrpcMethod('VideoMetadataGRPC', 'GetAllVideoMetadata')
    async getAllVideoMetadata() {
        const r = await this.videoMetadataService.getAllMetadata();
        return r;
    }
}
