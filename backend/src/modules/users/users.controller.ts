import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles('ADMIN')
  async findAll(@Req() req: any) {
    return this.usersService.findAll(req.user.role);
  }

  @Post()
  @Roles('ADMIN')
  async create(@Body() body: any, @Req() req: any) {
    return this.usersService.create(req.user.role, body);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async delete(@Param('id') id: string, @Req() req: any) {
    return this.usersService.delete(req.user.role, parseInt(id));
  }
}