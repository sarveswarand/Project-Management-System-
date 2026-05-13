import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/global-exception-filter'; 
import { LoggingInterceptor } from './common/interceptor/logging-interceptor';
import { ResponseInterceptor } from './common/interceptor/response-interceptor';
import { ThrottlerGuard } from '@nestjs/throttler';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    const config = new DocumentBuilder()
    .setTitle('Project Management API')
    .setDescription('API documentation for project management system')
    .setVersion('1.0')
    .addBearerAuth() 
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
);
  app.useGlobalFilters( new GlobalExceptionFilter())
  app.useGlobalInterceptors(new LoggingInterceptor())
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalGuards(app.get(ThrottlerGuard));
  app.useGlobalInterceptors(
  new ClassSerializerInterceptor(app.get(Reflector)),
);
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Server is running on port ${process.env.PORT ?? 3000}`);
}
bootstrap();
