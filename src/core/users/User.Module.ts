import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseConnectionName } from '../../infra/database/Database.Module';
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
          collection: 'charges',
        },
      ],
      DatabaseConnectionName.PayEver,
    ),
    HttpModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
