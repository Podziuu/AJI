import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const token = req.user;

    if (!token) {
      throw new UnauthorizedException('User is not authorized');
    }

    try {
      const userId = token.id;

      const user = await this.prisma.user.findUnique({
        where: {id: userId},
      })

      if (!user || !user.role) {
        throw new ForbiddenException('User is not authorized');
      }

      if (user.role === 'WORKER') {
        return true;
      } else {
        throw new ForbiddenException('Access denied');
      }
    } catch (err) {
      throw new ForbiddenException('Invalid token or role');
    }
  }
}
