import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../entities/user.entity';
import { ClientSession, FilterQuery, Model, UpdateQuery } from 'mongoose';

@Injectable()
export class UserRepository {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async add(model: Partial<User>) {
        const newUser = new this.userModel({...model});
        const r = await newUser.save();
        return r;
    }


    async findOne(query: FilterQuery<User>, fields: string[] = ['']) {
        try {
            const user = await this.userModel
                .findOne(query)
                .select(fields.join(' '));
            return user;
        } catch {
            return null;
        }
    }

    async findOneAndUpdate(
        query: FilterQuery<User>,
        update: UpdateQuery<User>,
        session?: ClientSession,
    ) {
        try {
            const options = session ? { session } : {};
            const r = await this.userModel
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

    async findOneAndDelete(query: FilterQuery<User>, session?: ClientSession) {
        const options = session ? { session } : {};
        const user = await this.userModel
            .findOneAndDelete(query, options)
            .exec();

        if (!user) {
            return null;
        }
        return user;
    }

    async findMany(
        query: FilterQuery<User>,
        fields: string[] = [''],
    ) {
        try {
            const r = await this.userModel
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
        query: FilterQuery<User>,
        update: UpdateQuery<User>,
        session?: ClientSession,
    ) {
        try {
            const options = session ? { session } : {};
            const result = await this.userModel
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

    async findManyAndDelete(query: FilterQuery<User>, session?: ClientSession) {
        try {
            const options = session ? { session } : {};
            const r = await this.userModel.deleteMany(query, { ...options });

            if (!r) {
                return null;
            }
            return r;
        } catch (ex) {
            return null;
        }
    }
}
