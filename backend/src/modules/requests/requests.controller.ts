import { Controller, Get, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('requests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RequestsController {
  constructor(private requestsService: RequestsService) {}

  @Get()
  @Roles('ADMIN', 'ASSISTANT')
  async findAll(@Req() req: any) {
    return this.requestsService.findAll(req.user.role);
  }

  @Post(':id/approve')
  @Roles('ADMIN', 'ASSISTANT')
  async approve(@Param('id') id: string, @Req() req: any) {
    return this.requestsService.approve(parseInt(id), req.user.userId);
  }

  @Post(':id/reject')
  @Roles('ADMIN', 'ASSISTANT')
  async reject(@Param('id') id: string, @Body() body: { notes: string }, @Req() req: any) {
    return this.requestsService.reject(parseInt(id), req.user.userId, body.notes);
  }
}