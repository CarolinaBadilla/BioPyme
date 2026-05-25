import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(userRole: string) {
    if (userRole !== 'ADMIN') {
      throw new ForbiddenException('Solo administradores pueden ver usuarios');
    }
    return this.prisma.user.findMany({
      select: { id: true, email: true, role: true, name: true, createdAt: true },
    });
  }

  async create(userRole: string, data: { email: string; password: string; role: string; name?: string }) {
    if (userRole !== 'ADMIN') {
      throw new ForbiddenException('Solo administradores pueden crear usuarios');
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: data.role as any,
        name: data.name,
      },
      select: { id: true, email: true, role: true, name: true },
    });
  }

  async delete(userRole: string, id: number) {
    if (userRole !== 'ADMIN') {
      throw new ForbiddenException('Solo administradores pueden eliminar usuarios');
    }
    return this.prisma.user.delete({ where: { id } });
  }
}