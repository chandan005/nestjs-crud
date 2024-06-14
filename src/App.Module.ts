import { Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './App.Controller';
import { UserModule } from './core/users/User.Module';
import { DatabaseModule } from './infra/database/Database.Module';
import { SendGridModule } from './infra/sendgrid/Sendgrid.Module';
import { RabbitMQModule } from './infra/rabbitmq/RabbitMQ.Module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/env/${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    ThrottlerModule.forRoot(),
    EventEmitterModule.forRoot(),
    DatabaseModule,
    UserModule,
    SendGridModule,
    RabbitMQModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule implements NestModule {
  configure() {}
}
