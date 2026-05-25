import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MapService {
  constructor(private prisma: PrismaService) {}

  async getRegions() {
    return this.prisma.region.findMany({
      include: { departments: { include: { cities: true } } },
    });
  }

  async getDepartments() {
    return this.prisma.department.findMany({
      include: { region: true, cities: true },
    });
  }

  async getCities() {
    return this.prisma.city.findMany({
      include: { department: { include: { region: true } } },
    });
  }

  async getCompaniesByCity() {
    return this.prisma.company.findMany({
      where: { isApproved: true },
      select: {
        id: true,
        name: true,
        latitude: true,
        longitude: true,
        type: true,
        biodieselPrice: true,
        cityId: true,
      },
    });
  }
}