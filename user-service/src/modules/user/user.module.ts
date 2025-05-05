import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './repositories/user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { MinioModule } from '../minio/minio.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema,
                collection: 'users',
                discriminators: [],
            },
        ]),
        MinioModule,
    ],
    controllers: [UserController],
    providers: [UserService, UserRepository],
})
export class UserModule {}
