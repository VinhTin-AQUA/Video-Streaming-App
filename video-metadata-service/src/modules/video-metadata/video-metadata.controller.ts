import { Controller } from '@nestjs/common';
import { VideoMetadataService } from './video-metadata.service';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('video-metadata')
export class VideoMetadataController {
    constructor(private readonly videoMetadataService: VideoMetadataService) {}

    @GrpcMethod('VideoMetadataGRPC', 'AddVideoMetadata')
    async addVideoMetadata(request: AddVideoMetadataRequest) {
        const r = await this.videoMetadataService.addVideoMetadata(request);
        return r;
    }

    @GrpcMethod('VideoMetadataGRPC', 'GetAllVideoMetadata')
    async getAllVideoMetadata() {
        const r = await this.videoMetadataService.getAllMetadata();
        return r;
    }
    
    @GrpcMethod('VideoMetadataGRPC', 'UpdateVideoMetadata')
    async updateVideoMetadata(request: UpdateVideoMetadataRequest) {
        const r = await this.videoMetadataService.updateVideoMetadata(request);
        return r;
    }

    @GrpcMethod('VideoMetadataGRPC', 'GetVideoMetadatasOfUser')
    async getVideoMetadatasOfUser(request: GetVideoMetadatasOfUserRequest) {
        const r = await this.videoMetadataService.getVideoMetadatasOfUser(request);
        return r;
    }
}
