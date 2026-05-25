import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const totalCompanies = await this.prisma.company.count({ where: { isApproved: true } });
    const totalStock = await this.prisma.company.aggregate({ _sum: { stockLiters: true }, where: { isApproved: true } });
    const avgPrice = await this.prisma.company.aggregate({ _avg: { biodieselPrice: true }, where: { isApproved: true } });
    const totalEmployees = await this.prisma.company.aggregate({ _sum: { employees: true }, where: { isApproved: true } });

    return {
      totalCompanies,
      totalStock: totalStock._sum.stockLiters || 0,
      avgPrice: avgPrice._avg.biodieselPrice || 0,
      totalEmployees: totalEmployees._sum.employees || 0,
    };
  }
}