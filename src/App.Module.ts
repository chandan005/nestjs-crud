import { Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './App.Controller';
import { DatabaseModule } from './config/Database.Module';

@Module({
  imports: [ThrottlerModule.forRoot(), EventEmitterModule.forRoot(), DatabaseModule],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule implements NestModule {
  configure() {}
}
