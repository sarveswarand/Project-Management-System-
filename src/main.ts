import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/global-exception-filter'; 
import { LoggingInterceptor } from './common/interceptor/logging-interceptor';
import { ResponseInterceptor } from './common/interceptor/response-interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
);
  app.useGlobalFilters( new GlobalExceptionFilter())
  app.useGlobalInterceptors(new LoggingInterceptor())
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Server is running on port ${process.env.PORT ?? 3000}`);
}
bootstrap();
