import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { MapLayersService } from './map-layers.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('map-layers')
export class MapLayersController {
  constructor(private mapLayersService: MapLayersService) {}

  // Obtener todas las categorías y sus puntos juntos (Ideal para renderizar el mapa)
  @Get('full')
  async findAllFull() {
    return this.mapLayersService.findAllCategoriesWithFeatures();
  }

  // --- GESTIÓN DE CATEGORÍAS ---
  @Get('categories')
  async getCategories() {
    return this.mapLayersService.findAllCategories();
  }

  @Post('categories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  async createCategory(@Body() body: any) {
    return this.mapLayersService.createCategory(body);
  }

  @Delete('categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteCategory(@Param('id') id: string) {
    return this.mapLayersService.removeCategory(+id);
  }

  // --- GESTIÓN DE PUNTOS ---
  @Post('features')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR', 'ASSISTANT')
  async createFeature(@Body() body: any) {
    return this.mapLayersService.createFeature(body);
  }

  @Put('features/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR', 'ASSISTANT')
  async updateFeature(@Param('id') id: string, @Body() body: any) {
    return this.mapLayersService.updateFeature(+id, body);
  }

  @Delete('features/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  async deleteFeature(@Param('id') id: string) {
    return this.mapLayersService.removeFeature(+id);
  }
}