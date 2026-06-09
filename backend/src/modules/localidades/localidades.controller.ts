import { Controller, Get } from '@nestjs/common';
import { LocalidadesService } from './localidades.service';

@Controller('localidades')
export class LocalidadesController {
  constructor(private localidadesService: LocalidadesService) {}

  @Get()
  async findAll() {
    return this.localidadesService.findAll();
  }
}