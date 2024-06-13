import { Module } from '@nestjs/common';
import { SendGridModule } from '../../infra/sendgrid/Sendgrid.Module';
import { UserModule } from '../users/User.Module';
import { UserEventListenerService } from './UserEventListener.Service';

@Module({
  imports: [UserModule, SendGridModule],
  exports: [UserEventListenerService],
  providers: [UserEventListenerService],
})
export class EventListenerModule {}
