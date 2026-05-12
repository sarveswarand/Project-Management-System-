import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';

import request from 'supertest';

import { AppModule } from '../../app.module';

describe('CommentsController (integration)', () => {
  let app: INestApplication;

  // Replace with real JWT token from your login API
  let accessToken: string;

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

    // Login and get JWT token
    const loginResponse = await request(
      app.getHttpServer(),
    )
      .post('/auth/login')
      .send({
        email: 'sarveswaran.d@tringapps.net',
        password: 'password@123',
      });

    accessToken =
      loginResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/comments', () => {
    it('should create comment', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .post('/comments')
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        )
        .send({
          content: 'Integration test comment',
          taskId: 9,
          userId: "1396eed0-12d3-4e81-b636-cc81bf4d31bd",
        });

      expect(response.status).toBe(201);

      expect(response.body).toHaveProperty(
        'id',
      );

      expect(response.body.content).toBe(
        'Integration test comment',
      );
    });

    it('should fail without JWT token', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .post('/comments')
        .send({
          content: 'Unauthorized comment',
          taskId: 9,
          userId: "1396eed0-12d3-4e81-b636-cc81bf4d31bd",
        });

      expect(response.status).toBe(401);
    });

    it('should get comment by id', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .get('/comments/19')
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        );

      expect(response.status).toBe(200);
    });

    it('should return 404 for invalid comment id', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .get('/comments/99999')
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        );

      expect(response.status).toBe(404);
    });

    // it('should get comments by task with pagination', async () => {
    //   const response = await request(
    //     app.getHttpServer(),
    //   )
    //     .get(
    //       '/comments/task/9?page=1&limit=10',
    //     )
    //     .set(
    //       'Authorization',
    //       `Bearer ${accessToken}`,
    //     );

    //   expect(response.status).toBe(200);

    //   expect(Array.isArray(response.body)).toBe(
    //     true,
    //   );
    // });
    it('should get comments by task with pagination', async () => {
  const response = await request(
    app.getHttpServer(),
  )
    .get('/comments/task/9?page=1&limit=10')
    .set(
      'Authorization',
      `Bearer ${accessToken}`,
    );

  console.log(response.body);

  expect(response.body).toHaveProperty(
  'data',
);

expect(
  Array.isArray(response.body.data),
).toBe(true);
});

    it('should fail validation for invalid task id', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .get('/comments/task/abc')
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        );

      expect(response.status).toBe(400);
    });

    it('should update comment', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .patch('/comments/19')
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        )
        .send({
          content: 'Updated integration comment',
        });

      expect(response.status).toBe(200);
    });

    it('should delete comment', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .delete('/comments/19')
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        );

      expect(response.status).toBe(204);
    });
  });
});