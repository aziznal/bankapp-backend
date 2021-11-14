import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Handles user login requests
   *
   * @param {LoginDto} loginDto
   * @param {Response} response
   * @memberof AuthController
   */
  @Post()
  login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
    response.cookie('auth', 'yup'); // don't @ me. this is a work in progess
    return this.authService.login(loginDto);
  }
}
