import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { AuthAccount } from '../entities/auth-account.entity';

@Injectable()
export class AuthAccountRepository {
    constructor(
        @InjectModel(AuthAccount.name)
        private authAccountModel: Model<AuthAccount>,
    ) {}

    async register(
        model: Omit<AuthAccount, '_id'>,
    ): Promise<AuthAccount | null> {
        const newAccount = new this.authAccountModel(model);
        const r = await newAccount.save();
        if (!r) {
            return null;
        }
        return r;
    }

    async findOneByQuery(
        query: FilterQuery<AuthAccount>,
        fields: string[] = [],
    ) {
        const r = await this.authAccountModel
            .findOne(query)
            .select(fields.join(' '))
            .exec();
        return r;
    }
}
