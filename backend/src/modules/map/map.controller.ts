import { Controller, Get } from '@nestjs/common';
import { MapService } from './map.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('map')
@Controller('map')
export class MapController {
  constructor(private mapService: MapService) {}

  @Get('regions')
  @ApiOperation({ summary: 'Obtener todas las regiones' })
  async getRegions() {
    return this.mapService.getRegions();
  }

  @Get('departments')
  @ApiOperation({ summary: 'Obtener todos los departamentos' })
  async getDepartments() {
    return this.mapService.getDepartments();
  }

  @Get('cities')
  @ApiOperation({ summary: 'Obtener todas las ciudades' })
  async getCities() {
    return this.mapService.getCities();
  }

  @Get('companies')
  @ApiOperation({ summary: 'Obtener empresas agrupadas por ciudad' })
  async getCompanies() {
    return this.mapService.getCompaniesByCity();
  }
}