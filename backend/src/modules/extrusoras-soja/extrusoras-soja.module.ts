import { Module } from '@nestjs/common';
import { ExtrusorasSojaService } from './extrusoras-soja.service';
import { ExtrusorasSojaController } from './extrusoras-soja.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ExtrusorasSojaController],
  providers: [ExtrusorasSojaService],
})
export class ExtrusorasSojaModule {}