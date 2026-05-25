import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async registerManager(email: string, password: string, companyData: any) {
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new ConflictException('El email ya está registrado');

    const hashedPassword = await bcrypt.hash(password, 10);

    const company = await this.prisma.company.create({
      data: {
        name: companyData.name,
        cuit: companyData.cuit,
        address: companyData.address,
        latitude: companyData.latitude || null,
        longitude: companyData.longitude || null,
        type: 'PLANTA',
        biodieselPrice: 0,
        fossilDieselPrice: 0,
        variableCost: 0,
        fixedCost: 0,
        stockLiters: 0,
        monthlyDemand: 0,
        dailyCapacity: 0,
        employees: 0,
        qualityCertified: false,
        selloB100: false,
        productionMonth: 0,
        isApproved: false,
        ownerId: 0,
      },
    });

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'ORGANIZATION_MANAGER',
        name: companyData.name,
        companyId: company.id,
      },
    });

    await this.prisma.company.update({
      where: { id: company.id },
      data: { ownerId: user.id },
    });

    const token = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });
    return {
      user: { id: user.id, email: user.email, role: user.role, companyId: user.companyId },
      token,
    };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Credenciales inválidas');

    const token = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });
    return {
      user: { id: user.id, email: user.email, role: user.role, companyId: user.companyId },
      token,
    };
  }
}