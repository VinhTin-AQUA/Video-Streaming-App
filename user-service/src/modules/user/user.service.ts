import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Types } from 'mongoose';
import { UserRepository } from './repositories/user.repository';
import { GrpcStatusCode } from 'src/common/exception/grpc-status-code';
import { MinioService } from '../minio/minio.service';
import { USER_AVATAR_BUCKET } from 'src/common/const/minIO.contants';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepo: UserRepository,
        private minioService: MinioService,
    ) {}

    async addUser(request: AddUserRequest): Promise<UserInterface> {
        const userExists = await this.userRepo.findOne({
            email: request.email,
        });

        if (userExists) {
            throw new RpcException({
                code: GrpcStatusCode.INVALID_ARGUMENT,
                message:
                    'Email này đã được đăng ký. Vui lòng sử dụng email khác',
            });
        }
        const r = await this.userRepo.add({
            ...request,
            _id: new Types.ObjectId(request.id),
            avatarUrl:
                'https://i.pinimg.com/736x/4c/2f/4c/4c2f4c74905d199957af7ee23489a9db.jpg',
        });
        if (!r) {
            throw new RpcException({
                code: GrpcStatusCode.INVALID_ARGUMENT,
                message: 'Không thể thêm người dùng',
            });
        }

        return {
            id: r._id.toString(),
            avatarUrl: '',
            email: r.email,
            fullName: r.fullName,
        };
    }

    async updateUser(request: UpdateUserRequest): Promise<UserInterface> {
        const r = await this.userRepo.findOneAndUpdate(
            { _id: request.id },
            request,
        );

        if (!r) {
            throw new RpcException({
                code: GrpcStatusCode.INVALID_ARGUMENT,
                message: 'User not found',
            });
        }

        return {
            id: r._id.toString(),
            avatarUrl: r.avatarUrl,
            email: r.email,
            fullName: r.fullName,
        };
    }

    async getUserById(request: GetUserByIdRequest) {
        const r = await this.userRepo.findOne({
            _id: request.userId,
        });

        if (!r) {
            throw new RpcException({
                code: GrpcStatusCode.NOT_FOUND,
                message: 'User not found',
            });
        }
        r.avatarUrl = await this.minioService.genGetPresignedUrl(USER_AVATAR_BUCKET, r._id.toString() + '.jpg');

        return r;
    }

    async initUpdateUserAvatar(request: InitUserAvatarUploadRequest): Promise<InitUserAvatarUploadResponse> {
        const avatarUploadUrl = await this.minioService.getPutPresignedUrl(
            USER_AVATAR_BUCKET,
            `${request.userId}.jpg`,
        );
        return {
            userAvatarUploadUrl: avatarUploadUrl
        };
    }
}
