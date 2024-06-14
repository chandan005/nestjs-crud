import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@sendgrid/client';
import SendgridMail = require('@sendgrid/mail');

@Injectable()
export class SendGridService {
  constructor(private readonly configService: ConfigService) {
    SendgridMail.setClient(new Client());
    SendgridMail.setApiKey(this.configService.get('SENDGRID_API_KEY') || '');
  }

  async sendEmail(to: string, subject: string, text: string) {
    try {
      SendgridMail.send({
        to,
        from: { name: `Payever`, email: 'no-reply@payever.com' },
        subject,
        text,
      });
    } catch (err) {
      console.error(err);
    }
  }
}
