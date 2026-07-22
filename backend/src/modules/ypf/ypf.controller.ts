import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { YpfService } from './ypf.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('ypf')
export class YpfController {
  constructor(private ypfService: YpfService) {}

  @Get()
  async findAll() {
    return this.ypfService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ypfService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR', 'ASSISTANT')
  async update(
    @Param('id') id: string,
    @Body() updateData: any,
  ) {
    return this.ypfService.update(+id, updateData);
  }
}