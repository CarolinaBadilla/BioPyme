import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class YpfService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.ypfStation.findMany({
      orderBy: { nombre: 'asc' }
    });
  }

  async findOne(id: number) {
    const estacion = await this.prisma.ypfStation.findUnique({
      where: { id }
    });
    
    if (!estacion) {
      throw new NotFoundException(`Estación YPF con ID ${id} no encontrada`);
    }
    
    return estacion;
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    
    return this.prisma.ypfStation.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
  }
}