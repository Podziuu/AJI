import { Controller, Get } from '@nestjs/common';

@Controller('/api/status')
export class StatusController {
  @Get()
  findAll() {
    return 'This action returns all statuses';
  }
}
