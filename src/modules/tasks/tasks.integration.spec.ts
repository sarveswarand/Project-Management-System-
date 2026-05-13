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
import { TaskStatus } from '../../common/enums/tasks.enum';

describe('TaskController (integration)', () => {
  let app: INestApplication;

  let accessToken: string;

  let createdUserId: string;
  let createdProjectId: number;
  let createdTaskId: number;

  const adminUser = {
    name: 'Task Admin',
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

    // CREATE USER
    await request(app.getHttpServer())
      .post('/user/create')
      .send(adminUser);

    // LOGIN
    const loginResponse = await request(
      app.getHttpServer(),
    )
      .post('/auth/login')
      .send({
        email: adminUser.email,
        password: adminUser.password,
      });

    accessToken =
      loginResponse.body.access_token;

    // GET CURRENT USER
    const currentUserResponse =
      await request(app.getHttpServer())
        .get('/user')
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        );

    createdUserId =
      currentUserResponse.body.id;

    // CREATE PROJECT
    const projectResponse = await request(
      app.getHttpServer(),
    )
      .post('/project/create')
      .set(
        'Authorization',
        `Bearer ${accessToken}`,
      )
      .send({
        name: 'Task Test Project',
        description:
          'Project for task testing',
        userIds: [createdUserId],
      });

    createdProjectId =
      projectResponse.body.id;

    console.log(
      'Created Project ID:',
      createdProjectId,
    );
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/task', () => {
    it('should create task', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .post('/task')
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        )
        .send({
          title: 'Test Task',
          description:
            'Task Description',
          projectId: 5,
          userId: "1396eed0-12d3-4e81-b636-cc81bf4d31bd",
        });

      console.log(
        'Create Task Response:',
        response.body,
      );

      expect(response.status).toBe(201);

      expect(response.body).toHaveProperty(
        'id',
      );

      createdTaskId = response.body.id;
    });

    it('should fail without token', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .post('/task')
        .send({
          title: 'Unauthorized Task',
          projectId: createdProjectId,
        });

      expect(response.status).toBe(401);
    });

    it('should get all tasks', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .get('/task?page=1&limit=10')
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        );

      expect(response.status).toBe(200);

      expect(response.body).toBeDefined();
    });

    it('should get task by id', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .get(`/task/${createdTaskId}`)
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        );

      console.log(response.body);

      expect(response.status).toBe(200);

      expect(response.body).toHaveProperty(
        'id',
      );
    });

    it('should return 404 for invalid task id', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .get('/task/999999')
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        );

      expect(response.status).toBe(404);
    });

    it('should update task status', async () => {
      const response = await request(
        app.getHttpServer(),
      )
        .patch(`/task/${createdTaskId}`)
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        )
        .send({
          status: TaskStatus.DONE,
        });

      console.log(response.body);

      expect(response.status).toBe(200);
    });

    it('should assign task to another user', async () => {
      const userEmail = `taskuser${Date.now()}@test.com`;

      // CREATE USER
      await request(app.getHttpServer())
        .post('/user/create')
        .send({
          name: 'Assigned User',
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

      // GET USER
      const currentUserResponse =
        await request(app.getHttpServer())
          .get('/user')
          .set(
            'Authorization',
            `Bearer ${loginUserResponse.body.access_token}`,
          );

      const newUserId =
        currentUserResponse.body.id;

      const response = await request(
        app.getHttpServer(),
      )
        .patch(
          `/task/${createdTaskId}/assign/33a37d29-d566-4ea6-b307-c47b12fd0535`,
        )
        .set(
          'Authorization',
          `Bearer ${accessToken}`,
        );

      console.log(response.body);

      expect(response.status).toBe(200);
    });
  });
});