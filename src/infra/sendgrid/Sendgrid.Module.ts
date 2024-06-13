import { Module } from '@nestjs/common';

@Module({
  providers: [SendGridService],
  exports: [SendGridService],
})
export class SendGridModule {}
