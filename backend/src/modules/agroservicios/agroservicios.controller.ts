import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { AgroserviciosService } from './agroservicios.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('/agroservicios')
export class AgroserviciosController {
  constructor(private agroserviciosService: AgroserviciosService) {}

  @Get()
  async findAll() {
    return this.agroserviciosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.agroserviciosService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR', 'ASSISTANT')
  async update(
    @Param('id') id: string,
    @Body() updateData: any,
  ) {
    return this.agroserviciosService.update(+id, updateData);
  }
}