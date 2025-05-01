import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, FilterQuery, Model, UpdateQuery } from 'mongoose';
import { AuthAccount } from '../entities/auth-account.entity';

@Injectable()
export class AuthAccountRepository {
    constructor(
        @InjectModel(AuthAccount.name)
        private authAccountModel: Model<AuthAccount>,
    ) {}

    async add(model: Omit<AuthAccount, '_id'>): Promise<AuthAccount | null> {
        const newAccount = new this.authAccountModel(model);
        const r = await newAccount.save();
        if (!r) {
            return null;
        }
        return r;
    }

    async findOne(query: FilterQuery<AuthAccount>, fields: string[] = ['']) {
        try {
            const user = await this.authAccountModel
                .findOne(query)
                .select(fields.join(' '));
            return user;
        } catch {
            return null;
        }
    }

    async findOneAndUpdate(
        query: FilterQuery<AuthAccount>,
        update: UpdateQuery<AuthAccount>,
        session?: ClientSession,
    ) {
        try {
            const options = session ? { session } : {};
            const r = await this.authAccountModel
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
        query: FilterQuery<AuthAccount>,
        session?: ClientSession,
    ) {
        const options = session ? { session } : {};
        const user = await this.authAccountModel
            .findOneAndDelete(query, options)
            .exec();

        if (!user) {
            return null;
        }
        return user;
    }

    async findMany(query: FilterQuery<AuthAccount>, fields: string[] = ['']) {
        try {
            const r = await this.authAccountModel
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
        query: FilterQuery<AuthAccount>,
        update: UpdateQuery<AuthAccount>,
        session?: ClientSession,
    ) {
        try {
            const options = session ? { session } : {};
            const result = await this.authAccountModel
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
        query: FilterQuery<AuthAccount>,
        session?: ClientSession,
    ) {
        try {
            const options = session ? { session } : {};
            const r = await this.authAccountModel.deleteMany(query, {
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
