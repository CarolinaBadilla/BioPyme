import { Controller, Get } from '@nestjs/common';
import { CompaniesService } from './companies.service';

@Controller('companies')
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  @Get('map')
  async getForMap() {
    return this.companiesService.getApprovedCompanies();
  }

  
}