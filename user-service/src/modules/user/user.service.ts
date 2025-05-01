import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Types } from 'mongoose';
import { UserRepository } from './repositories/user.repository';
import { GrpcStatusCode } from 'src/common/exception/grpc-status-code';

@Injectable()
export class UserService {
    constructor(private readonly userRepo: UserRepository) {}

    async addUser(model: AddUserRequest): Promise<UserInterface> {
        const userExists = await this.userRepo.findOne({ email: model.email });

        if (userExists) {
            throw new RpcException({
                code: GrpcStatusCode.INVALID_ARGUMENT,
                message:
                    'Email này đã được đăng ký. Vui lòng sử dụng email khác',
            });
        }
        const r = await this.userRepo.add({
            ...model,
            _id: new Types.ObjectId(model.id),
            avatarUrl: 'https://i.pinimg.com/736x/4c/2f/4c/4c2f4c74905d199957af7ee23489a9db.jpg'
        });
        if (!r) {
            throw new RpcException({
                code: GrpcStatusCode.INVALID_ARGUMENT,
                message: 'Không thể thêm người dùng',
            });
        }

        return {
            id: r._id.toString(),
            avatartUrl: '',
            email: r.email,
            fulleName: r.fullName,
        };
    }

    async updateUser(model: UpdateUserRequest): Promise<UserInterface> {
        const r = await this.userRepo.findOneAndUpdate(
            { _id: model.id },
            model,
        );

        if (!r) {
            throw new RpcException({
                code: GrpcStatusCode.INVALID_ARGUMENT,
                message: 'Người dùng không tìm thấy',
            });
        }

        return {
            id: r._id.toString(),
            avatartUrl: r.avatarUrl,
            email: r.email,
            fulleName: r.fullName,
        };
    }
}
