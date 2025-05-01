import { Module } from '@nestjs/common';
import { KafkaProducerService } from './kafka-producer.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: 'KAFKA_SERVICE',
                inject: [ConfigService],
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.KAFKA,
                    options: {
                        client: {
                            clientId: 'user',
                            brokers: [
                                configService.get<string>(
                                    'KAFKA_URI',
                                    'localhost:9092',
                                ),
                            ],
                        },
                    },
                }),
            },
        ]),
    ],
    providers: [KafkaProducerService],
    exports: [KafkaProducerService],
})
export class KafkaModule {}
