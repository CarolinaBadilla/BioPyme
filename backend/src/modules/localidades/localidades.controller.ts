import { Controller, Get, Param, Post, Put, Body, UseGuards, Delete } from '@nestjs/common';
import { LocalidadesService } from './localidades.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('localidades')
export class LocalidadesController {
  constructor(private localidadesService: LocalidadesService) {}

  @Get()
  async findAll() {
    return this.localidadesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.localidadesService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  async create(@Body() data: any) {
    return this.localidadesService.create(data);
  }
  
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR', 'ASSISTANT')
  async update(@Param('id') id: string, @Body() updateData: any) {
    return this.localidadesService.update(+id, updateData);
  }
  
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  async remove(@Param('id') id: string) {
    return this.localidadesService.remove(+id);
  }
  
}