import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
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
}
