import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { RequestsModule } from './modules/requests/requests.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { MapModule } from './modules/map/map.module';
import { PrismaModule } from './prisma/prisma.module';
import { YpfModule } from './modules/ypf/ypf.module';
import { LocalidadesModule } from './modules/localidades/localidades.module';
import { EstacionesBlancasModule } from './modules/estaciones-blancas/estaciones-blancas.module'; // 👈 AGREGAR
import { DepartamentosModule } from './modules/departamentos/departamentos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CompaniesModule,
    RequestsModule,
    DashboardModule,
    MapModule,
    YpfModule,
    LocalidadesModule,
    EstacionesBlancasModule,
    DepartamentosModule,
  ],
})
export class AppModule {}