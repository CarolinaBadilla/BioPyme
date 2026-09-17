import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MapLayersService {
  constructor(private prisma: PrismaService) {}

  // --- CATEGORÍAS ---
  async findAllCategories() {
    return this.prisma.mapCategory.findMany({
      include: { _count: { select: { features: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async createCategory(data: { name: string; slug: string; description?: string; color?: string; icon?: string }) {
    return this.prisma.mapCategory.create({ data });
  }

  async removeCategory(id: number) {
    return this.prisma.mapCategory.delete({ where: { id } });
  }

  // --- PUNTOS / FEATURES DE LAS CAPAS ---
  async findFeaturesByCategory(categoryId: number) {
    return this.prisma.mapFeature.findMany({
      where: { categoryId },
      orderBy: { name: 'asc' },
    });
  }

  // Endpoint unificado para que el Frontend cargue todas las capas y puntos de una sola vez
  async findAllCategoriesWithFeatures() {
    return this.prisma.mapCategory.findMany({
      include: {
        features: true,
      },
    });
  }

  async createFeature(data: { categoryId: number; name: string; latitude: number; longitude: number; properties?: any }) {
    return this.prisma.mapFeature.create({
      data: {
        categoryId: data.categoryId,
        name: data.name,
        latitude: data.latitude,
        longitude: data.longitude,
        properties: data.properties || {},
      },
    });
  }

  async updateFeature(id: number, data: any) {
    const feature = await this.prisma.mapFeature.findUnique({ where: { id } });
    if (!feature) throw new NotFoundException(`Punto con ID ${id} no encontrado`);

    return this.prisma.mapFeature.update({
      where: { id },
      data: {
        name: data.name ?? feature.name,
        latitude: data.latitude ?? feature.latitude,
        longitude: data.longitude ?? feature.longitude,
        properties: data.properties ?? feature.properties,
        updatedAt: new Date(),
      },
    });
  }

  async removeFeature(id: number) {
    const feature = await this.prisma.mapFeature.findUnique({ where: { id } });
    if (!feature) throw new NotFoundException(`Punto con ID ${id} no encontrado`);
    return this.prisma.mapFeature.delete({ where: { id } });
  }
}