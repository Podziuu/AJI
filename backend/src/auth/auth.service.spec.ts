// @ts-nocheck

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { RegisterUserDTO } from 'src/auth/dto/registerUserDTO';
import { LoginUserDTO } from './dto/loginUserDTO';

jest.mock('bcrypt');
jest.mock('@nestjs/jwt');

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };

    const mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should throw ConflictException if user already exists', async () => {
      const registerUserDTO: RegisterUserDTO = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: Role.CLIENT,
      };

      prismaService.user.findUnique.mockResolvedValueOnce({
        id: '1',
        email: registerUserDTO.email,
        name: registerUserDTO.name,
        password: 'hashedpassword',
        role: registerUserDTO.role,
      });

      await expect(authService.register(registerUserDTO)).rejects.toThrowError(
        new ConflictException('User with this email already exists'),
      );
    });

    it('should successfully register a new user and return tokens', async () => {
      const registerUserDTO: RegisterUserDTO = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: Role.CLIENT,
      };

      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedpassword');

      prismaService.user.create.mockResolvedValue({
        id: '1',
        email: registerUserDTO.email,
        name: registerUserDTO.name,
        password: 'hashedpassword',
        role: registerUserDTO.role,
      });

      jwtService.sign.mockReturnValueOnce('accessToken');
      jwtService.sign.mockReturnValueOnce('refreshToken');

      const result = await authService.register(registerUserDTO);
      expect(result).toEqual({
        user: { name: 'Test User', email: 'test@example.com' },
        at: 'accessToken',
        rt: 'refreshToken',
      });
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      const loginUserDTO: LoginUserDTO = { email: 'test@example.com', password: 'password123' };

      prismaService.user.findUnique.mockResolvedValueOnce(null);

      await expect(authService.login(loginUserDTO)).rejects.toThrowError(
        new UnauthorizedException('Could not find user with this email'),
      );
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const loginUserDTO: LoginUserDTO = { email: 'test@example.com', password: 'password123' };

      prismaService.user.findUnique.mockResolvedValueOnce({
        id: '1',
        email: loginUserDTO.email,
        name: 'Test User',
        password: 'hashedpassword',
        role: Role.CLIENT,
      });

      bcrypt.compare.mockResolvedValueOnce(false);

      await expect(authService.login(loginUserDTO)).rejects.toThrowError(
        new UnauthorizedException('Invalid email or password'),
      );
    });

    it('should successfully login and return tokens', async () => {
      const loginUserDTO: LoginUserDTO = { email: 'test@example.com', password: 'password123' };

      prismaService.user.findUnique.mockResolvedValueOnce({
        id: '1',
        email: loginUserDTO.email,
        name: 'Test User',
        password: 'hashedpassword',
        role: Role.CLIENT,
      });

      bcrypt.compare.mockResolvedValueOnce(true);

      jwtService.sign.mockReturnValueOnce('accessToken');
      jwtService.sign.mockReturnValueOnce('refreshToken');

      const result = await authService.login(loginUserDTO);
      expect(result).toEqual({
        user: { name: 'Test User', email: 'test@example.com' },
        at: 'accessToken',
        rt: 'refreshToken',
      });
    });
  });

  describe('generateTokens', () => {
    it('should generate access and refresh tokens', async () => {
      const userId = '1';
      jwtService.sign.mockReturnValueOnce('accessToken');
      jwtService.sign.mockReturnValueOnce('refreshToken');

      const result = await authService.generateTokens(userId);
      expect(result).toEqual({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });
    });
  });

  describe('refreshToken', () => {
    it('should throw UnauthorizedException if token is invalid', async () => {
      const refreshToken = 'invalidToken';
      jwtService.verify.mockImplementationOnce(() => {
        throw new Error('Invalid token');
      });

      await expect(authService.refreshToken(refreshToken)).rejects.toThrowError(
        new UnauthorizedException('Invalid or expired token'),
      );
    });

    it('should successfully refresh token and return new tokens', async () => {
      const refreshToken = 'validRefreshToken';
      const payload = { id: '1' };
      const user = { id: '1', email: 'test@example.com', name: 'Test User' };

      jwtService.verify.mockReturnValueOnce(payload);
      prismaService.user.findUnique.mockResolvedValueOnce(user);

      jwtService.sign.mockReturnValueOnce('newAccessToken');
      jwtService.sign.mockReturnValueOnce('newRefreshToken');

      const result = await authService.refreshToken(refreshToken);
      expect(result).toEqual({
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
      });
    });
  });
});
