import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SendGridService } from '../../infra/sendgrid/Sendgrid.Service';
import { User } from '../users/entities/User.Entity';

export const USER_CREATED = 'user.created.event';

@Injectable()
export class UserEventListenerService {
  constructor(private readonly sendgridService: SendGridService) {}

  @OnEvent(USER_CREATED, { async: true })
  sendRegistrationMail(user: User) {
    if (user.email) {
      this.sendgridService.sendEmail(user.email, 'Welcome', 'Thank you for registering!');
    }
  }
}
