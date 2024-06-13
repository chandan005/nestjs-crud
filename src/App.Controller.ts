import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('ecomm-cx')
@Controller()
export class AppController {
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @Get('/health/v1')
  health(): void {
    return;
  }
}
