import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka, ClientKafkaProxy } from '@nestjs/microservices';
import { log } from 'console';
import { lastValueFrom } from 'rxjs';
import { KAFKA_REGISTER_USER_TOPIC } from 'src/common/const/kafka,contant';

@Injectable()
export class KafkaProducerService {
    constructor(
        @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    ) {}

    async onModuleInit() {
        this.kafkaClient.subscribeToResponseOf(KAFKA_REGISTER_USER_TOPIC);
    }

    async sendMessage(topic: string, message: any) {
        try {
            await lastValueFrom(this.kafkaClient.emit(topic, message));
        } catch (error) {
            throw error;
        }
    }

    async sendMessageWithResponse(topic: string, message: any) {
        try {
            const r = await lastValueFrom(this.kafkaClient.send(topic, message));
            return r;
        } catch (error) {
            throw error;
        }
    }

    async onApplicationShutdown() {
        await this.kafkaClient.close();
    }
}
