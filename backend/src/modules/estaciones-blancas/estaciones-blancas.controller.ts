import { Controller, Get } from '@nestjs/common';
import { EstacionesBlancasService } from './estaciones-blancas.service';

@Controller('estaciones-blancas')
export class EstacionesBlancasController {
  constructor(private estacionesBlancasService: EstacionesBlancasService) {}

  @Get()
  async findAll() {
    return this.estacionesBlancasService.findAll();
  }
}