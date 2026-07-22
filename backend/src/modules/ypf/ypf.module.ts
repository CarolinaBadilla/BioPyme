import { Module } from '@nestjs/common';
import { YpfService } from './ypf.service';
import { YpfController } from './ypf.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [YpfController],
  providers: [YpfService],
})
export class YpfModule {}