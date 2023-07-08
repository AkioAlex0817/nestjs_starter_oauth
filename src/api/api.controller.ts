import { Controller, Get } from '@nestjs/common';

@Controller('api')
export class ApiController {
  @Get('status')
  status() {
    return { success: true, version: '1.0.1', build: 2 };
  }
}
