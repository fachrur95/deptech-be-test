import { HttpExceptionFilter, ResponseInterceptor } from '@app/common';
import {
  BadRequestException,
  INestApplication,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationError } from 'class-validator';
import cookieParser from 'cookie-parser';
import { Logger as PinoLogger } from 'nestjs-pino';
import { version } from '../package.json';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3000;

  app.setGlobalPrefix('v1', { exclude: ['/'] });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (errors) =>
        new BadRequestException(formatErrors(errors)),
    }),
  );
  app.useLogger(app.get(PinoLogger));
  app.use(cookieParser());
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ResponseInterceptor(reflector));
  app.useGlobalFilters(new HttpExceptionFilter());

  setupSwagger(app);

  await app.listen(port);

  new Logger().log(
    `Application version ${version} is listening on port ${port}`,
  );
}
bootstrap();

function formatErrors(errors: ValidationError[]) {
  return errors.flatMap((error) => {
    if (error.children && error.children.length > 0) {
      return formatErrors(error.children);
    }

    return {
      field: error.property,
      message: Object.values(error.constraints || {}),
    };
  });
}

function setupSwagger(app: INestApplication<any>) {
  const config = new DocumentBuilder()
    .setTitle('Coding Test Fullstack Deptech API Docs')
    .setDescription('Coding Test Fullstack Deptech API documentation')
    .setVersion(version)
    .addTag('Code Test Fullstack Deptech')
    .addBearerAuth(
      { type: 'http', scheme: 'Bearer', bearerFormat: 'JWT', in: 'header' },
      'Authorization',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });
}
