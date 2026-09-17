import { Module } from '@nestjs/common';
import { MapLayersController } from './map-layers.controller';
import { MapLayersService } from './map-layers.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MapLayersController],
  providers: [MapLayersService],
  exports: [MapLayersService],
})
export class MapLayersModule {}