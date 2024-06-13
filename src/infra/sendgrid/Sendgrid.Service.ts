import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class SendGridService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
  }

  async sendEmail(to: string, subject: string, text: string) {
    try {
      sgMail.send({
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
