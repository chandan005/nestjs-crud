import { Module } from '@nestjs/common';
import { SendGridService } from './Sendgrid.Service';

@Module({
  providers: [SendGridService],
  exports: [SendGridService],
})
export class SendGridModule {}
