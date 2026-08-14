import { Module } from '@nestjs/common';
import { AgroserviciosService } from './agroservicios.service';
import { AgroserviciosController } from './agroservicios.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AgroserviciosController],
  providers: [AgroserviciosService],
})
export class AgroserviciosModule {}