import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';

import request from 'supertest';

import { AppModule } from '../../app.module';

describe('UserController (integration)', () => {
  let app: INestApplication;

  let accessToken: string;

  const testUser = {
    name: 'Integration User',
    email: 'integration@test.com',
    password: '123456',
    role: 'admin',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    // Create user
    await request(app.getHttpServer())
      .post('/user/create')
      .send(testUser);

    // Login user
    const loginResponse = await request(
      app.getHttpServer(),
    )
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    accessToken =
      loginResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/user', () => {
    let createdUserEmail: string;

it('should create user', async () => {
  createdUserEmail = `user${Date.now()}@test.com`;

  const response = await request(
    app.getHttpServer(),
  )
    .post('/user/create')
    .send({
      name: 'Another User',
      email: createdUserEmail,
      password: '123456',
      role: 'admin',
    });

  expect(response.status).toBe(201);

   expect(response.body).toHaveProperty(
    'message',
    'user created',
  );
});

    it('should fail validation for invalid email', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .post('/user/create')
        .send({
          name: 'Invalid User',
          email: 'invalid-email',
          password: '123456',
          role: 'user',
        });

      expect(response.status).toBe(400);
    });

    it('should get current user', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .get('/user')
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        );

      expect(response.status).toBe(200);
    });

    it('should fail without JWT token', async () => {
      const response = await request(
        app.getHttpServer(),
      ).get('/user');

      expect(response.status).toBe(401);
    });

    it('should get all users as admin', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .get(
          '/user/all?page=1&limit=10',
        )
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        );

      expect(response.status).toBe(200);
    });

    it('should update password', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .patch('/user')
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        )
        .send({
          email: testUser.email,
          newPassword: 'newpassword123',
        });

      expect(response.status).toBe(200);
    });

    it('should delete user', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .delete('/user')
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        )
        .send({
          email: createdUserEmail,
        });

      expect(response.status).toBe(204);
    });
  });
});