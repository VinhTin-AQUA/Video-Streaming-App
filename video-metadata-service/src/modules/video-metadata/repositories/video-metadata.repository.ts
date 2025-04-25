import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { VideoMetadata } from '../entities/video-metadata.entity';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

@Injectable()
export class VideoMetadataRepository {
    constructor(
        @InjectModel(VideoMetadata.name)
        private videoMetadataModel: Model<VideoMetadata>,
    ) {}

    async addVideoMetada(model: Omit<VideoMetadata, '_id'>) {
        const newVideoMetadata = new this.videoMetadataModel({
            ...model,
            status: 'pending',
        });
        const r = await newVideoMetadata.save();
        return r;
    }

    async findManyByQuery(query: FilterQuery<VideoMetadata>) {
        const r = await this.videoMetadataModel.find(query).exec();
        return r;
    }

    async findOneAndUpdate(
        query: FilterQuery<VideoMetadata>,
        update: UpdateQuery<VideoMetadata>,
    ) {
        const r = await this.videoMetadataModel.findOneAndUpdate(query, update);
        return r;
    }
}
