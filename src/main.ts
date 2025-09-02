import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './shared/presentation/http/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // DTO’da olmayan alanları at
      forbidNonWhitelisted: true, // ekstra field varsa 400 fırlat
      transform: true,       // tip dönüşümlerini aktif et
    }),
  );

  await app.listen(3000);
}
bootstrap();
