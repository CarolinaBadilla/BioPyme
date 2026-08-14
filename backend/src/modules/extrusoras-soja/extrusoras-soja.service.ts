import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ExtrusorasSojaService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.extrusoraSoja.findMany({
      orderBy: { razonSocial: 'asc' },
    });
  }

  async findOne(id: number) {
    const extrusora = await this.prisma.extrusoraSoja.findUnique({ where: { id } });
    if (!extrusora) {
      throw new NotFoundException(`Extrusora de soja con ID ${id} no encontrada`);
    }
    return extrusora;
  }

  async create(data: any) {
    return this.prisma.extrusoraSoja.create({ data });
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    return this.prisma.extrusoraSoja.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    });
  }
}