import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import 'dotenv/config';
import { AppModule } from './app.module';

const { WEB_URL, PORT = '3000' } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: [WEB_URL!],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    },
  });
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Utils4Dev')
    .setVersion('1.0')
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, {
      operationIdFactory: (_, methodKey) => methodKey,
    });
  SwaggerModule.setup('docs', app, documentFactory, {
    jsonDocumentUrl: '/docs/json',
  });

  await app.listen(PORT);
}
bootstrap();
