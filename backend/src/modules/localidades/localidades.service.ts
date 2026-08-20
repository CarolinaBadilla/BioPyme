import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LocalidadesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.localidad.findMany();
  }

  async findOne(id: number) {
    return this.prisma.localidad.findUnique({ where: { id } });
  }

  async create(data: any) {
    return this.prisma.localidad.create({ data });
  }

  async update(id: number, data: any) {
    return this.prisma.localidad.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.localidad.delete({ where: { id } });
  }
}