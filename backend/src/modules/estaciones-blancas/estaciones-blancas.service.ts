import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EstacionesBlancasService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.estacionBlanca.findMany();
  }
}