import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

@Schema()
export class VideoMetadata {
    @Prop({ type: SchemaTypes.ObjectId, auto: true })
    _id: Types.ObjectId;

    @Prop()
    title: string;

    @Prop()
    description: string;

    @Prop()
    formatName: string;

    @Prop({ type: Number })
    duration: number;

    @Prop({ type: Number })
    size: number;

    @Prop()
    status: string;

    @Prop()
    thumbnailUrl: string;

    @Prop({ type: SchemaTypes.Boolean, default: true })
    isPublic: boolean;

    @Prop({ })
    userId: string;
}

export type VideoMetadataDocument = HydratedDocument<VideoMetadata>;
export const VideoMetadataSchema = SchemaFactory.createForClass(VideoMetadata);
