import { Injectable } from '@nestjs/common';
import { VideoMetadataRepository } from './repositories/video-metadata.repository';
import { RpcException } from '@nestjs/microservices';
import { Types } from 'mongoose';

@Injectable()
export class VideoMetadataService {
    constructor(private videoMetadataRepository: VideoMetadataRepository) {}

    async addVideoMetadata(
        model: AddVideoMetadataRequest,
    ): Promise<VideoMetadata> {
        const r = await this.videoMetadataRepository.add({
            ...model,
            status: 'pending',
        });
        return {
            id: r._id.toString(),
            artist: r.artist,
            desciption: r.desciption,
            duration: r.duration,
            filename: r.filename,
            formatname: r.formatname,
            size: r.size,
            title: r.title,
            status: r.status,
            thumbnailUrl: r.thumbnailUrl,
            isPublic: r.isPublic,
        };
    }

    async getAllMetadata(): Promise<GetAllVideoMetadataResponse> {
        const r = await this.videoMetadataRepository.findMany({});
        const response = r.map((v: any) => {
            return {
                id: v._id.toString(),
                artist: v.artist,
                desciption: v.desciption,
                duration: v.duration,
                filename: v.filename,
                formatname: v.formatname,
                size: v.size,
                title: v.title,
            };
        }) as VideoMetadata[];
        return {
            videoMetadatas: response,
        };
    }

    async updateVideoMetadata(
        model: UpdateVideoMetadataRequest,
    ): Promise<VideoMetadata> {
        const r = await this.videoMetadataRepository.findOneAndUpdate(
            { _id: new Types.ObjectId(model.id) },
            model,
        );

        if (!r) {
            throw new RpcException({
                code: 5, // mã lỗi gRPC
                message: 'Không tìm thấy video',
            });
        }
        return {
            artist: r.artist,
            desciption: r.desciption,
            duration: r.duration,
            filename: r.filename,
            formatname: r.formatname,
            id: r._id.toString(),
            size: r.size,
            status: r.status,
            title: r.title,
            thumbnailUrl: r.thumbnailUrl,
            isPublic: r.isPublic,
        };
    }
}
