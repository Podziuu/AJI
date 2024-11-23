import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RegisterUserDTO } from 'src/auth/dto/registerUserDTO';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerUserDTO: RegisterUserDTO) {
    const { name, email, password } = registerUserDTO;

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const { accessToken, refreshToken } = await this.generateTokens(newUser.id);

    return {
      user: { name: newUser.name, email: newUser.email },
      at: accessToken,
      rt: refreshToken,
    };
  }

  async generateTokens(userId: string) {
    const payload = { id: userId };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
      secret: process.env.JWT_SECRET,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_REFRESH_SECRET,
    });

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.prisma.user.findUnique({
        where: {
          id: payload.id,
        },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      return this.generateTokens(user.id);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
