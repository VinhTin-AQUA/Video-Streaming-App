import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

@Schema()
export class User {
    @Prop({ type: SchemaTypes.ObjectId, auto: true })
    _id: Types.ObjectId;

    @Prop()
    fulleName: string;

    @Prop()
    email: string;

    @Prop()
    avatartUrl: string;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
