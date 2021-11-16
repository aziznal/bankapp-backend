import { Body, Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { SuccessResponse, TSuccessResponse } from 'src/common/success.response';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

/**
 * Main Authentication and Verification requests controller
 *
 * @export
 * @class AuthController
 */
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Login method that logs user in using email/password combination. Returns JWT
   *
   * Note: the function looks empty but in fact, it's the guard that takes care
   * of most of the logic for authenticating the user.
   *
   * @memberof AuthController
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify')
  verify(): TSuccessResponse {
    return SuccessResponse;
  }
}
