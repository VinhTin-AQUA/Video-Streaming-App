import { Injectable } from '@nestjs/common';
import { VideoMetadataRepository } from './repositories/video-metadata.repository';
import { RpcException } from '@nestjs/microservices';
import { Types } from 'mongoose';
import { MinioService } from '../minio/minio.service';
import { RAW_VIDEOS_BUCKET_NAME } from 'src/common/const/minio.contants';

@Injectable()
export class VideoMetadataService {
    constructor(
        private videoMetadataRepository: VideoMetadataRepository,
        private minioService: MinioService,
    ) {}

    async addVideoMetadata(
        model: AddVideoMetadataRequest,
    ): Promise<VideoMetadata> {
        const r = await this.videoMetadataRepository.add({
            ...model,
            status: 'pending',
        });

        return {
            id: r._id.toString(),
            description: r.description,
            duration: r.duration,
            formatName: r.formatName,
            size: r.size,
            title: r.title,
            status: r.status,
            thumbnailUrl: r.thumbnailUrl,
            isPublic: r.isPublic,
            userId: r.userId,
        };
    }

    async getAllMetadata(): Promise<GetAllVideoMetadataResponse> {
        const r = await this.videoMetadataRepository.findMany({});
        const response = r.map((v: any) => {
            return {
                id: v._id.toString(),
                description: v.description,
                duration: v.duration,
                formatName: v.formatName,
                size: v.size,
                title: v.title,
                thumbnailUrl: v.thumbnailUrl,
                status: v.status,
                isPublic: v.isPublic,
                userId: v.userId,
            };
        }) as VideoMetadata[];

        for (let i of response) {
            i.thumbnailUrl = await this.minioService.createPresignedUrl(
                RAW_VIDEOS_BUCKET_NAME,
                `/${i.userId}/${i.id}/thumbnail.jpg`,
            );
        }

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
            id: r._id.toString(),
            description: r.description,
            duration: r.duration,
            formatName: r.formatName,
            size: r.size,
            title: r.title,
            thumbnailUrl: r.thumbnailUrl,
            isPublic: r.isPublic,
            status: r.status,
            userId: r.userId,
        };
    }
}
