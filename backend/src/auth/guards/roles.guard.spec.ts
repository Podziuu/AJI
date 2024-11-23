import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from './roles.guard'; 
import { PrismaService } from 'src/prisma.service';
import { ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let prisma: PrismaService;
  let context: ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    prisma = module.get<PrismaService>(PrismaService);
    context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: { id: 'userId' }, 
        }),
      }),
    } as any;
  });

  it('should throw UnauthorizedException if no user is found in the request', async () => {
    context.switchToHttp().getRequest().user = null;

    await expect(guard.canActivate(context)).rejects.toThrowError(UnauthorizedException);
  });

  it('should throw ForbiddenException if user role is not WORKER', async () => {
    prisma.user.findUnique = jest.fn().mockResolvedValue({ id: 'userId', role: 'CLIENT' });

    await expect(guard.canActivate(context)).rejects.toThrowError(ForbiddenException);
  });

  it('should return true if user role is WORKER', async () => {
    prisma.user.findUnique = jest.fn().mockResolvedValue({ id: 'userId', role: 'WORKER' });

    const result = await guard.canActivate(context);

    expect(result).toBe(true); 
  });

  it('should throw ForbiddenException if an error occurs while fetching user from DB', async () => {
    prisma.user.findUnique = jest.fn().mockRejectedValue(new Error('Database error'));

    await expect(guard.canActivate(context)).rejects.toThrowError(ForbiddenException);
  });
});
