// auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from '../../common/jwt-strategy';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: 'MY_SECRET_KEY', 
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([User])
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy,UserService],
})
export class AuthModule {}