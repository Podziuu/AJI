import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard'; 
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: JwtService;
  let context: ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get<JwtService>(JwtService);
    context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {},
        }),
      }),
    } as any;
  });

  it('should throw UnauthorizedException if no token is provided', async () => {
    context.switchToHttp().getRequest().headers['authorization'] = undefined;

    await expect(guard.canActivate(context)).rejects.toThrowError(UnauthorizedException);
  });

  it('should throw UnauthorizedException if token is invalid or expired', async () => {
    context.switchToHttp().getRequest().headers['authorization'] = 'Bearer invalidToken';

    jwtService.verifyAsync = jest.fn().mockRejectedValue(new Error('Invalid or expired token'));

    await expect(guard.canActivate(context)).rejects.toThrowError(UnauthorizedException);
  });

  it('should set user in the request object if token is valid', async () => {
    const validToken = 'validToken';
    const decodedPayload = { userId: '123', role: 'WORKER' };
    context.switchToHttp().getRequest().headers['authorization'] = `Bearer ${validToken}`;

    jwtService.verifyAsync = jest.fn().mockResolvedValue(decodedPayload);

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(context.switchToHttp().getRequest().user).toEqual(decodedPayload);
  });
});
