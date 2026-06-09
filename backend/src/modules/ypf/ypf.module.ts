import { Module } from '@nestjs/common';
import { YpfService } from './ypf.service';
import { YpfController } from './ypf.controller';

@Module({
  controllers: [YpfController],
  providers: [YpfService],
})
export class YpfModule {}