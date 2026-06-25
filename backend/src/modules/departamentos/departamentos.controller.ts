import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('departamentos')
export class DepartamentosController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.department.findMany({
      select: {
        name: true,
        totalViviendas: true,
        viviendasColectivas: true,
        viviendasParticulares: true,
        hogares: true,
        poblacionTotal: true,
        poblacionViviendasParticulares: true,
        poblacionViviendasColectivas: true,
        poblacionCalle: true,
        mujeres: true,
        varones: true,
      },
    });
  }
}