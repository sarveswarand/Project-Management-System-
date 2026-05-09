import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { ProjectModule } from './modules/project/project.module';
import { TaskModule } from './modules/tasks/tasks.module';
import { CommentsModule } from './modules/comments/comments.module';
import { AuthModule } from './modules/auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuditInterceptor } from './common/interceptor/audit-interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Audit } from './common/decorators/audit.decorator';
import { AuditModule } from './modules/audit/audit.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import KeyvRedis from 'node_modules/@keyv/redis/dist';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
    type:'mysql',
    host:process.env.DATABASE_HOST,
    port:parseInt(process.env.DATABASE_PORT || '3306'),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
    logging:['query','error','warn'],
    // logging: true,
    maxQueryExecutionTime: 1000, 
  }),
  // CacheModule.registerAsync({
  //     isGlobal: true,

  //     useFactory: async () => ({
  //       stores: [
  //         await redisStore({
  //           socket: {
  //             host: 'localhost',
  //             port: 6379,
  //           },

  //           ttl: 60,
  //         }),
  //       ],
  //     }),
  //   }),
  CacheModule.registerAsync({
      isGlobal: true,

      useFactory: async () => ({
        store: [
          new KeyvRedis('redis://localhost:6379'),
        ],
      }),
    }),
  UserModule,
  ProjectModule,
  TaskModule,
  CommentsModule,
  AuthModule,
  AuditModule,
  ],
  controllers: [AppController],
  providers: [AppService,ThrottlerGuard,
  //    {
  //   provide: APP_INTERCEPTOR,
  //   useClass: AuditInterceptor,
  // },
  {
    provide: APP_INTERCEPTOR,
    useClass: CacheInterceptor,
  }
  ],
})
export class AppModule {}
