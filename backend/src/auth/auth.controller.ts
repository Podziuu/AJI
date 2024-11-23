import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDTO } from 'src/auth/dto/registerUserDTO';
import { Response, Request } from 'express';

@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async register(
    @Body() registerUserDTO: RegisterUserDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, at, rt } = await this.authService.register(registerUserDTO);

    res.cookie('refreshToken', rt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { user, at };
  }

  @Post('/refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const rt = req.cookies['refreshToken'];

    if (!rt) {
      throw new UnauthorizedException('Refresh token is required');
    }

    const { accessToken, refreshToken } =
      await this.authService.refreshToken(rt);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken };
  }
}
