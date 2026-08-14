import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ExtrusorasSojaService } from './extrusoras-soja.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('extrusoras-soja')
export class ExtrusorasSojaController {
  constructor(private extrusorasSojaService: ExtrusorasSojaService) {}

  @Get()
  async findAll() {
    return this.extrusorasSojaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.extrusorasSojaService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  async create(@Body() data: any) {
    return this.extrusorasSojaService.create(data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR', 'ASSISTANT')
  async update(@Param('id') id: string, @Body() updateData: any) {
    return this.extrusorasSojaService.update(+id, updateData);
  }
}