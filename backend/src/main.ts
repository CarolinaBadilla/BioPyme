import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // ✅ CONFIGURACIÓN CORS CORRECTA
  app.enableCors({
    origin: [
      'http://localhost:5173',           // Desarrollo local
      'https://biopyme.onrender.com/',    // Tu frontend en producción // Si usas otro nombre
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');
  
  await app.listen(process.env.PORT || 3001);
  console.log('🚀 Backend corriendo en http://localhost:' + (process.env.PORT || 3001));
}
bootstrap();