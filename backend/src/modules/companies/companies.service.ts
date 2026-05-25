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

  async getCompanyById(id: number, userId: number, userRole: string, userCompanyId: number | null) {
    const company = await this.prisma.company.findUnique({ where: { id } });
    if (!company) throw new NotFoundException('Empresa no encontrada');

    if (userRole !== 'ADMIN' && userRole !== 'ASSISTANT') {
      if (company.ownerId !== userId) {
        throw new ForbiddenException('No tienes permiso para ver esta empresa');
      }
    }
    return company;
  }

  async updateCompany(id: number, updateData: any, userId: number, userRole: string) {
    const company = await this.prisma.company.findUnique({ where: { id } });
    if (!company) throw new NotFoundException('Empresa no encontrada');

    if (userRole === 'ORGANIZATION_MANAGER' && company.ownerId !== userId) {
      throw new ForbiddenException('Solo puedes editar tu propia empresa');
    }

    return this.prisma.company.update({
      where: { id },
      data: updateData,
    });
  }
}