import { Logger } from '@nestjs/common';

export class AppService {
  private readonly logger = new Logger(AppService.name);
}
