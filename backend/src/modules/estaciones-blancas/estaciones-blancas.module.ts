import { Module } from '@nestjs/common';
import { EstacionesBlancasService } from './estaciones-blancas.service';
import { EstacionesBlancasController } from './estaciones-blancas.controller';

@Module({
  controllers: [EstacionesBlancasController],
  providers: [EstacionesBlancasService],
})
export class EstacionesBlancasModule {}