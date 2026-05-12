import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import request from 'supertest';

import { AppModule } from '../../app.module';

describe('ProjectController (integration)', () => {
  let app: INestApplication;

  let accessToken: string;
  let createdProjectId: number;
  let createdUserId: string;

  const adminUser = {
    name: 'Project Admin',
    email: `admin${Date.now()}@test.com`,
    password: 'password123',
    role: 'admin',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app =
      moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    // CREATE ADMIN USER
    const createUserResponse =
      await request(app.getHttpServer())
        .post('/user/create')
        .send(adminUser);

    console.log(
      'Create User Response:',
      createUserResponse.body,
    );

    // LOGIN ADMIN
    const loginResponse = await request(
      app.getHttpServer(),
    )
      .post('/auth/login')
      .send({
        email: adminUser.email,
        password: adminUser.password,
      });

    console.log(
      'Login Response:',
      loginResponse.body,
    );

    accessToken = loginResponse.body.access_token;

    // GET CURRENT USER
    const currentUserResponse =
      await request(app.getHttpServer())
        .get('/user')
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        );

    console.log(
      'Current User Response:',
      currentUserResponse.body,
    );

    createdUserId = currentUserResponse.body.id;

    console.log(
      'Created User ID:',
      createdUserId,
    );
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/project', () => {
    it('should create project', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .post('/project/create')
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        )
        .send({
          name: 'Test Project',
          description:
            'Test Description',
          userIds: [createdUserId],
        });

      console.log(
        'Create Project Response:',
        response.body,
      );

      expect(response.status).toBe(201);

      expect(response.body).toHaveProperty(
  'id',
);

createdProjectId =
  response.body.id;

      console.log(
        'Created Project ID:',
        createdProjectId,
      );
    });

    it('should fail without JWT token', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .post('/project/create')
        .send({
          name: 'Unauthorized Project',
          description: 'Description',
          userIds: [createdUserId],
        });

      expect(response.status).toBe(401);
    });

    it('should get all projects', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .get(
          '/project/all?page=1&limit=10',
        )
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        );

      console.log(
        'Get All Projects:',
        response.body,
      );

      expect(response.status).toBe(200);

      expect(response.body).toBeDefined();
    });

    it('should get project by id', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .get(
          `/project/${createdProjectId}`,
        )
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        );

      console.log(
        'Get Project By ID:',
        response.body,
      );

      expect(response.status).toBe(200);

      expect(response.body).toHaveProperty(
  'id',
);
    });

    it('should return 404 for invalid project id', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .get('/project/999999')
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        );

      console.log(
        'Invalid Project Response:',
        response.body,
      );

      expect(response.status).toBe(404);
    });

    it('should update project', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .patch(
          `/project/${createdProjectId}`,
        )
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        )
        .send({
          name: 'Updated Project Name',
        });

      console.log(
        'Update Project Response:',
        response.body,
      );

      expect(response.status).toBe(200);
    });

    it('should add users to project', async () => {
      const userEmail = `user${Date.now()}@test.com`;

      // CREATE ANOTHER USER
      await request(app.getHttpServer())
        .post('/user/create')
        .send({
          name: 'Project User',
          email: userEmail,
          password: 'password123',
          role: 'user',
        });

      // LOGIN USER
      const loginUserResponse =
        await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: userEmail,
            password: 'password123',
          });

      const userAccessToken =
        loginUserResponse.body.data
          ?.access_token ||
        loginUserResponse.body
          .access_token;

      // GET USER DETAILS
      const currentUserResponse =
        await request(app.getHttpServer())
          .get('/user')
          .set(
            'Authorization',
            `Bearer ${userAccessToken}`,
          );

      const userId =
        currentUserResponse.body.data?.id ||
        currentUserResponse.body.id;

      console.log(
        'Second User ID:',
        userId,
      );

      const response = await request(
        app.getHttpServer(),
      )
        .post(
          `/project/${createdProjectId}/add-users`,
        )
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        )
        .send({
          userIds: [userId],
        });

      console.log(
        'Add Users Response:',
        response.body,
      );

      expect(response.status).toBe(200);
    });

    it('should delete project', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .delete(
          `/project/${createdProjectId}`,
        )
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        );

      console.log(
        'Delete Project Response:',
        response.body,
      );

      expect(response.status).toBe(204);
    });
  });
});