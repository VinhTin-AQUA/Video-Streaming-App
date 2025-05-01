import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { VideoMetadata } from '../entities/video-metadata.entity';
import { ClientSession, FilterQuery, Model, UpdateQuery } from 'mongoose';

@Injectable()
export class VideoMetadataRepository {
    constructor(
        @InjectModel(VideoMetadata.name)
        private videoMetadataModel: Model<VideoMetadata>,
    ) {}

    async add(model: Partial<VideoMetadata>) {
        const newUser = new this.videoMetadataModel({ ...model });
        const r = await newUser.save();
        return r;
    }

    async findOne(query: FilterQuery<VideoMetadata>, fields: string[] = ['']) {
        try {
            const user = await this.videoMetadataModel
                .findOne(query)
                .select(fields.join(' '));
            return user;
        } catch {
            return null;
        }
    }

    async findOneAndUpdate(
        query: FilterQuery<VideoMetadata>,
        update: UpdateQuery<VideoMetadata>,
        session?: ClientSession,
    ) {
        try {
            const options = session ? { session } : {};
            const r = await this.videoMetadataModel
                .findOneAndUpdate(query, update, {
                    ...options,
                    new: true,
                    runValidators: true,
                })
                .exec();

            if (!r) {
                return null;
            }
            return r;
        } catch (ex) {
            return null;
        }
    }

    async findOneAndDelete(
        query: FilterQuery<VideoMetadata>,
        session?: ClientSession,
    ) {
        const options = session ? { session } : {};
        const user = await this.videoMetadataModel
            .findOneAndDelete(query, options)
            .exec();

        if (!user) {
            return null;
        }
        return user;
    }

    async findMany(query: FilterQuery<VideoMetadata>, fields: string[] = ['']) {
        try {
            const r = await this.videoMetadataModel
                .find(query)
                .select(fields.join(' '))
                .exec();
            if (!r) {
                return [];
            }
            return r;
        } catch {
            return [];
        }
    }

    async findManyAndUpdate(
        query: FilterQuery<VideoMetadata>,
        update: UpdateQuery<VideoMetadata>,
        session?: ClientSession,
    ) {
        try {
            const options = session ? { session } : {};
            const result = await this.videoMetadataModel
                .updateMany(query, update, {
                    ...options,
                    new: true,
                    runValidators: true,
                })
                .exec();
            return result; // Trả về kết quả của updateMany
        } catch (error) {
            return null;
        }
    }

    async findManyAndDelete(
        query: FilterQuery<VideoMetadata>,
        session?: ClientSession,
    ) {
        try {
            const options = session ? { session } : {};
            const r = await this.videoMetadataModel.deleteMany(query, {
                ...options,
            });

            if (!r) {
                return null;
            }
            return r;
        } catch (ex) {
            return null;
        }
    }
}
