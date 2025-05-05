import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import {
    EventPattern,
    GrpcMethod,
    MessagePattern,
    Payload,
} from '@nestjs/microservices';
import { KAFKA_REGISTER_USER_TOPIC } from 'src/common/const/kafka,contant';
import { GrpcResponse } from 'src/common/response/grpc.response';
import { GrpcStatusCode } from 'src/common/exception/grpc-status-code';

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}

    // @EventPattern(KAFKA_REGISTER_USER_TOPIC)
    // eventPattern(@Payload() payload: any) {
    //     console.log(payload);
    // }

    @MessagePattern(KAFKA_REGISTER_USER_TOPIC)
    async getUserAdding(@Payload() payload: any) {
        const r = await this.userService.addUser({ ...payload });

        const response: GrpcResponse = {
            data: null,
            isSuccess: true,
            message: '',
            statusCode: GrpcStatusCode.OK,
        };
        return response;
    }

    @GrpcMethod('UserGRPC', 'GetUserById')
    async getUserById(request: GetUserByIdRequest) {
        const r = await this.userService.getUserById(request);
        return r;
    }

    @GrpcMethod('UserGRPC', 'InitUserAvatarUpload')
    async initUserAvatarUpload(request: InitUserAvatarUploadRequest) {
        const r = await this.userService.initUpdateUserAvatar(request);
        return r;
    }

    @GrpcMethod('UserGRPC', 'UpdateUser')
    async updateUser(request: UpdateUserRequest) {
        const r = await this.userService.updateUser(request);
        return r;
    }
}
