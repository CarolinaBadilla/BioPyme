import { Module } from '@nestjs/common';
import { DepartamentosController } from './departamentos.controller';

@Module({
  controllers: [DepartamentosController],
})
export class DepartamentosModule {}