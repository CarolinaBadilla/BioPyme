import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class RequestsService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(companyId: number, documentUrl?: string) {
    return this.prisma.request.create({
      data: { companyId, documentUrl, status: 'PENDING' },
    });
  }

  async findAll(userRole: string) {
    if (userRole !== 'ADMIN' && userRole !== 'ASSISTANT') {
      throw new ForbiddenException('No tienes permiso');
    }
    return this.prisma.request.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async approve(id: number, reviewerId: number) {
    const request = await this.prisma.request.update({
      where: { id },
      data: { status: 'APPROVED', reviewedBy: reviewerId, reviewedAt: new Date() },
    });
    
    await this.prisma.company.update({
      where: { id: request.companyId },
      data: { isApproved: true },
    });
    
    return request;
  }

  async reject(id: number, reviewerId: number, notes: string) {
    return this.prisma.request.update({
      where: { id },
      data: { status: 'REJECTED', reviewedBy: reviewerId, reviewedAt: new Date(), adminNotes: notes },
    });
  }
}