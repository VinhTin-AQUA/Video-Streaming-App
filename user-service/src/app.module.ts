import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { modules } from './modules';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongodbModule } from './core/mongodb/mongodb.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongodbModule,
        ...modules
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
