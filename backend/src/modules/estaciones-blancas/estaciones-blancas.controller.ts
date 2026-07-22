import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { EstacionesBlancasService } from './estaciones-blancas.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('estaciones-blancas')
export class EstacionesBlancasController {
  constructor(private estacionesBlancasService: EstacionesBlancasService) {}

  @Get()
  async findAll() {
    return this.estacionesBlancasService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.estacionesBlancasService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR', 'ASSISTANT')
  async update(
    @Param('id') id: string,
    @Body() updateData: any,
  ) {
    return this.estacionesBlancasService.update(+id, updateData);
  }
}