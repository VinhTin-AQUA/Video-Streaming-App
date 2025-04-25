import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

@Schema()
export class VideoMetadata {
    @Prop({ type: SchemaTypes.ObjectId, auto: true })
    _id: Types.ObjectId;

    @Prop()
    title: string;

    @Prop()
    desciption: string;

    @Prop()
    filename: string;

    @Prop()
    format_name: string;

    @Prop({ type: Number })
    duration: number;

    @Prop({ type: Number })
    size: number;

    @Prop()
    artist: string;
}

export type VideoMetadataDocument = HydratedDocument<VideoMetadata>;
export const VideoMetadataSchema = SchemaFactory.createForClass(VideoMetadata);
