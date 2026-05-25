import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register/manager')
  async registerManager(@Body() body: any) {
    return this.authService.registerManager(body.email, body.password, {
      name: body.companyName,
      cuit: body.cuit,
      address: body.address,
      latitude: body.latitude,
      longitude: body.longitude,
    });
  }

  @Post('login')
  async login(@Body() body: any) {
    return this.authService.login(body.email, body.password);
  }
}