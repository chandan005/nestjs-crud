import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseConnectionName } from '../../infra/database/Database.Module';
import { RabbitMQModule } from '../../infra/rabbitmq/RabbitMQ.Module';
import { UserController } from './User.Controller';
import { UserService } from './User.Service';
import { User, UserSchema } from './entities/User.Entity';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: User.name,
          schema: UserSchema,
          collection: 'users',
        },
      ],
      DatabaseConnectionName.PayEver,
    ),
    HttpModule,
    RabbitMQModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
