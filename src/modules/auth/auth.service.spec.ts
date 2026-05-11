import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;

  const mockUserService = {
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  /* ---------------- LOGIN SUCCESS ---------------- */
  it('should login successfully and return token', async () => {
    const loginDto = {
      email: 'test@mail.com',
      password: '1234',
    };

    const user = {
      id: 1,
      email: 'test@mail.com',
      password: 'hashed_password',
      role: 'USER',
    };

    mockUserService.findByEmail.mockResolvedValue(user);

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    mockJwtService.sign.mockReturnValue('jwt_token');

    const result = await service.login(loginDto);

    expect(mockUserService.findByEmail).toHaveBeenCalledWith(
      'test@mail.com',
    );

    expect(bcrypt.compare).toHaveBeenCalledWith(
      '1234',
      'hashed_password',
    );

    expect(mockJwtService.sign).toHaveBeenCalled();

    expect(result).toEqual({
      access_token: 'jwt_token',
    });
  });

  /* ---------------- USER NOT FOUND ---------------- */
  it('should throw UnauthorizedException if user not found', async () => {
    mockUserService.findByEmail.mockResolvedValue(null);

    await expect(
      service.login({
        email: 'test@mail.com',
        password: '1234',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  /* ---------------- INVALID PASSWORD ---------------- */
  it('should throw UnauthorizedException if password mismatch', async () => {
    const user = {
      id: 1,
      email: 'test@mail.com',
      password: 'hashed_password',
      role: 'USER',
    };

    mockUserService.findByEmail.mockResolvedValue(user);

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      service.login({
        email: 'test@mail.com',
        password: 'wrong',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});