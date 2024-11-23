import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDTO } from 'src/auth/dto/registerUserDTO';
import { Response } from 'express';

@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async register(
    @Body() registerUserDTO: RegisterUserDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const {user, token} = await this.authService.register(registerUserDTO);

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 1000,
    })

    return user;
  }
}
