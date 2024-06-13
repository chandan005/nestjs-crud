import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './App.Module';
import { HttpExceptionFilter } from './lib/filters/HttpExceptionFilter';
import { TrimPipe } from './lib/pipes/TrimPipe';

function setupSwagger(app: INestApplication): void {
  const documentBuilder = new DocumentBuilder()
    .setTitle('PayEver API')
    .setDescription('This is the API documentation for PayEver.')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { defaultModelsExpandDepth: -1 },
  });
}

function setupCors(app: INestApplication): void {
  const cors = {
    origin: ['*'],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
  };
  app.enableCors(cors);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(helmet());
  app.use(compression());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalPipes(new TrimPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  setupCors(app);
  setupSwagger(app);

  await app.listen(3000);
}

bootstrap();
