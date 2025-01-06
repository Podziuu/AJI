import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatusService } from './status.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('/api/status')
@UseGuards(AuthGuard)
export class StatusController {
  constructor(private statusService: StatusService) {}

  @Get()
  findAll() {
    return this.statusService.findAll();
  }
}
