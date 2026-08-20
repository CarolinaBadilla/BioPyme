import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AgroserviciosService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.agroservicio.findMany({
      orderBy: { nombre: 'asc' },
    });
  }

  async findOne(id: number) {
    const agroservicio = await this.prisma.agroservicio.findUnique({
      where: { id },
    });

    if (!agroservicio) {
      throw new NotFoundException(`Agroservicio con ID ${id} no encontrado`);
    }

    return agroservicio;
  }

  async update(id: number, data: any) {
    await this.findOne(id);

    return this.prisma.agroservicio.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.agroservicio.delete({ where: { id } });
  }

  async create(data: any) {
    return this.prisma.agroservicio.create({ data });
  }
}