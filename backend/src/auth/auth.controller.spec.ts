import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterUserDTO } from './dto/registerUserDTO';
import { LoginUserDTO } from './dto/loginUserDTO';
import { UnauthorizedException } from '@nestjs/common';
import { Response, Request } from 'express';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    refreshToken: jest.fn(),
  };

  const mockResponse = () => {
    const res: Partial<Response> = {};
    res.cookie = jest.fn().mockReturnThis();
    return res;
  };

  const mockRequest = (cookies: Record<string, string>) => {
    const req: Partial<Request> = { cookies };
    return req;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a user and set refresh token cookie', async () => {
      const registerUserDTO: RegisterUserDTO = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'CLIENT',
      };

      const mockTokens = {
        user: { name: 'Test User', email: 'test@example.com' },
        at: 'accessToken',
        rt: 'refreshToken',
      };

      const res = mockResponse();

      jest.spyOn(authService, 'register').mockResolvedValue(mockTokens);

      const result = await authController.register(registerUserDTO, res as Response);

      expect(authService.register).toHaveBeenCalledWith(registerUserDTO);
      expect(res.cookie).toHaveBeenCalledWith('refreshToken', mockTokens.rt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      expect(result).toEqual({ user: mockTokens.user, at: mockTokens.at });
    });
  });

  describe('login', () => {
    it('should login a user and set refresh token cookie', async () => {
      const loginUserDTO: LoginUserDTO = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockTokens = {
        user: { name: 'Test User', email: 'test@example.com' },
        at: 'accessToken',
        rt: 'refreshToken',
      };

      const res = mockResponse();

      jest.spyOn(authService, 'login').mockResolvedValue(mockTokens);

      const result = await authController.login(loginUserDTO, res as Response);

      expect(authService.login).toHaveBeenCalledWith(loginUserDTO);
      expect(res.cookie).toHaveBeenCalledWith('refreshToken', mockTokens.rt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      expect(result).toEqual({ user: mockTokens.user, at: mockTokens.at });
    });
  });

  describe('refresh', () => {
    it('should throw UnauthorizedException if refresh token is missing', async () => {
      const req = mockRequest({});
      const res = mockResponse();

      await expect(authController.refresh(req as Request, res as Response)).rejects.toThrowError(
        new UnauthorizedException('Refresh token is required'),
      );
    });

    it('should refresh tokens and set new refresh token cookie', async () => {
      const mockRefreshToken = 'validRefreshToken';
      const mockNewTokens = {
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
      };

      const req = mockRequest({ refreshToken: mockRefreshToken });
      const res = mockResponse();

      jest.spyOn(authService, 'refreshToken').mockResolvedValue(mockNewTokens);

      const result = await authController.refresh(req as Request, res as Response);

      expect(authService.refreshToken).toHaveBeenCalledWith(mockRefreshToken);
      expect(res.cookie).toHaveBeenCalledWith('refreshToken', mockNewTokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      expect(result).toEqual({ accessToken: mockNewTokens.accessToken });
    });
  });
});
