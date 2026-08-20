import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async getApprovedCompanies() {
    return this.prisma.company.findMany({
      where: { isApproved: true },
      select: {
        id: true,
        name: true,
        cuit: true,
        latitude: true,
        longitude: true,
        address: true,
        type: true,
        biodieselPrice: true,
        fossilDieselPrice: true,
        variableCost: true,
        fixedCost: true,
        stockLiters: true,
        monthlyDemand: true,
        dailyCapacity: true,
        employees: true,
        productionMonth: true,
        qualityCertified: true,
        selloB100: true,
        knowsChamber: true,
        isAssociated: true,
        wantsToAssociate: true,
        projectStatus: true,
        equipment: true,
        nominalCapacityRange: true,
        hasSecEnergyLicense: true,
        secEnergyProcessStatus: true,
        qualityControlled: true,
        hasAnalysis: true,
        satisfactoryResult: true,
        labReference: true,
        oilType: true,
      },
    });
  }

  async findOne(id: number) {
    const item = await this.prisma.company.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException(`Registro con ID ${id} no encontrado`);
    }

    return item;
  }

  async create(data: any) {
    // Eliminamos el id si viene en el body para que Postgres lo autogenere
    const { id, ...cleanData } = data;
    return this.prisma.company.create({
      data: {
        ...cleanData,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    const { id: _, ...cleanData } = data;

    return this.prisma.company.update({
      where: { id },
      data: {
        ...cleanData,
        updatedAt: new Date(),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.company.delete({
      where: { id },
    });
  }
}