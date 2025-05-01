import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { KAFKA_REGISTER_USER_TOPIC } from 'src/common/const/kafka,contant';

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}

    // @EventPattern(KAFKA_REGISTER_USER_TOPIC)
    // eventPattern(@Payload() payload: any) {
    //     console.log(payload);
    // }

    @MessagePattern(KAFKA_REGISTER_USER_TOPIC)
    getUserAdding(@Payload() payload: any) {
        console.log(payload);

        return { success: 'success' };
    }

    // async onModuleInit() {
    //     try {
    //         this.authClient.subscribeToResponseOf(KAFKA_REGISTER_USER_TOPIC);
    //         await this.authClient.connect();

    //         console.log('Connected to Kafka successfully');
    //     } catch (error) {
    //         console.error('Failed to connect to Kafka', error);
    //     }
    // }
}
