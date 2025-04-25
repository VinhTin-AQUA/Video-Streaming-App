import { Injectable } from '@nestjs/common';
import { VideoMetadataRepository } from './repositories/video-metadata.repository';

@Injectable()
export class VideoMetadataService {
    constructor(private videoMetadataRepository: VideoMetadataRepository) {}

    async addVideoMetadata(
        model: AddVideoMetadataRequest,
    ): Promise<VideoMetadata> {
        const r = await this.videoMetadataRepository.addVideoMetada(model);
        return {
            id: r._id.toString(),
            artist: r.artist,
            desciption: r.desciption,
            duration: r.duration,
            filename: r.filename,
            format_name: r.format_name,
            size: r.size,
            title: r.title,
        };
    }

    async getAllMetadata(): Promise<GetAllVideoMetadataResponse> {
        const r = await this.videoMetadataRepository.findManyByQuery({});
        const response = r.map((v: any) => {
            return {
                id: v._id.toString(),
                artist: v.artist,
                desciption: v.desciption,
                duration: v.duration,
                filename: v.filename,
                format_name: v.format_name,
                size: v.size,
                title: v.title,
            };
        }) as VideoMetadata[];
        return {
            videoMetadatas: response,
        };
    }
}
