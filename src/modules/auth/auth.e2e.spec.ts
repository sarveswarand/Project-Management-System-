import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';

import { AppModule } from '../../app.module';

describe('AuthController (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleFixture.createNestApplication();

    // same validation as main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/login', () => {
    it('should login successfully', async () => {
  const response = await request(app.getHttpServer())
    .post('/auth/login')
    .send({
      email: 'sarveswaran.d@tringapps.net',
      password: 'password@123',
    });

  expect(response.status).toBe(200);

  expect(response.body).toHaveProperty(
    'access_token',
  );
});

    it('should fail for invalid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'wrong@mail.com',
          password: 'wrongpass',
        });

      expect(response.status).toBe(401);

      expect(response.body.message).toBe(
        'Invalid credentials',
      );
    });

    it('should fail validation for invalid email', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'not-an-email',
          password: '123456',
        });

      expect(response.status).toBe(400);
    });
  });
});