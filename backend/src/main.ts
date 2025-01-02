import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { AuthGuard } from './auth/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    methods: 'GET,HEAD,POST,PUT,DELETE,PATCH',
    credentials: true,
  });
  // app.useGlobalGuards(new AuthGuard(new JwtService()));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
