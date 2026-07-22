import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EstacionesBlancasService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.estacionBlanca.findMany({
      orderBy: { nombre: 'asc' }
    });
  }

  async findOne(id: number) {
    const estacion = await this.prisma.estacionBlanca.findUnique({
      where: { id }
    });
    
    if (!estacion) {
      throw new NotFoundException(`Estación blanca con ID ${id} no encontrada`);
    }
    
    return estacion;
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    
    return this.prisma.estacionBlanca.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
  }
}