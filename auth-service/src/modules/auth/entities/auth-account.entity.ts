import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

@Schema()
export class AuthAccount {
    @Prop({ type: SchemaTypes.ObjectId, auto: true })
    _id: Types.ObjectId;

    @Prop()
    email: string;

    @Prop()
    password: string;
}

export type AuthAccountDocument = HydratedDocument<AuthAccount>;
export const AuthAccountSchema = SchemaFactory.createForClass(AuthAccount);
