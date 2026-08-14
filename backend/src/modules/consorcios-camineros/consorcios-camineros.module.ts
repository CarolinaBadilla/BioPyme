import { Module } from '@nestjs/common';
import { ConsorciosCaminerosService } from './consorcios-camineros.service';
import { ConsorciosCaminerosController } from './consorcios-camineros.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ConsorciosCaminerosController],
  providers: [ConsorciosCaminerosService],
})
export class ConsorciosCaminerosModule {}