import { Injectable } from '@nestjs/common';
import { VideoMetadataRepository } from './repositories/video-metadata.repository';
import { RpcException } from '@nestjs/microservices';
import { Types } from 'mongoose';
import { MinioService } from '../minio/minio.service';
import { ASSET_BUCKET_NAME, RAW_VIDEOS_BUCKET_NAME } from 'src/common/const/minio.contants';

@Injectable()
export class VideoMetadataService {
    constructor(
        private videoMetadataRepo: VideoMetadataRepository,
        private minioService: MinioService,
    ) {}

    async addVideoMetadata(
        request: AddVideoMetadataRequest,
    ): Promise<VideoMetadata> {
        const r = await this.videoMetadataRepo.add({
            ...request,
            status: 'pending',
            thumbnailUrl: '/loading.gif'
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
        const r = await this.videoMetadataRepo.findMany({});
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
            i.thumbnailUrl = await this.minioService.genGetPresignedUrl(
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
        const r = await this.videoMetadataRepo.findOneAndUpdate(
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

    async getVideoMetadatasOfUser(request: GetVideoMetadatasOfUserRequest) {
        const r = await this.videoMetadataRepo.findMany({
            userId: request.userId,
        });

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

            if(i.status === 'ready') {
                i.thumbnailUrl = await this.minioService.genGetPresignedUrl(
                    RAW_VIDEOS_BUCKET_NAME,
                    `/${i.userId}/${i.id}/thumbnail.jpg`,
                );
            }
            else {
                i.thumbnailUrl = await this.minioService.genGetPresignedUrl(
                    ASSET_BUCKET_NAME,
                    `/loading.gif`,
                );
            }

        }

        return {
            videoMetadatas: response,
        };
    }
}
