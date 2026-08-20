import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ConsorciosCaminerosService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.consorcioCaminero.findMany({
      orderBy: { nombre: 'asc' },
    });
  }

  async findOne(id: number) {
    const consorcio = await this.prisma.consorcioCaminero.findUnique({
      where: { id },
    });

    if (!consorcio) {
      throw new NotFoundException(`Consorcio caminero con ID ${id} no encontrado`);
    }

    return consorcio;
  }

  async create(data: any) {
    return this.prisma.consorcioCaminero.create({ data });
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    return this.prisma.consorcioCaminero.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.consorcioCaminero.delete({ where: { id } });
  }
}