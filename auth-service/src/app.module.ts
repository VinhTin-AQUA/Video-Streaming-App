import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongodbModule } from './core/mongodb/mongodb.module';
import { modules } from './modules';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongodbModule,
        ...modules,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
