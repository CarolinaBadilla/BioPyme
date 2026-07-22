import { Module } from '@nestjs/common';
import { EstacionesBlancasService } from './estaciones-blancas.service';
import { EstacionesBlancasController } from './estaciones-blancas.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EstacionesBlancasController],
  providers: [EstacionesBlancasService],
})
export class EstacionesBlancasModule {}