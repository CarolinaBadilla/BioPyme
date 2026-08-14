import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ConsorciosCaminerosService } from './consorcios-camineros.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('consorcios-camineros')
export class ConsorciosCaminerosController {
  constructor(private consorciosCaminerosService: ConsorciosCaminerosService) {}

  @Get()
  async findAll() {
    return this.consorciosCaminerosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.consorciosCaminerosService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  async create(@Body() data: any) {
    return this.consorciosCaminerosService.create(data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR', 'ASSISTANT')
  async update(@Param('id') id: string, @Body() updateData: any) {
    return this.consorciosCaminerosService.update(+id, updateData);
  }
}