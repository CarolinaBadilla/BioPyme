import { Controller, Get } from '@nestjs/common';
import { YpfService } from './ypf.service';

@Controller('ypf')
export class YpfController {
  constructor(private ypfService: YpfService) {}

  @Get()
  async findAll() {
    return this.ypfService.findAll();
  }
}