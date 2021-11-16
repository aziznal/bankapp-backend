import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
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
  /**
   * Login method that logs user in using email/password combination. Note: the
   *
   * function looks empty but in fact, it's the guard that takes care of most of
   * the logic for authenticating the user.
   *
   * @return {*}
   * @memberof AuthController
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(): TSuccessResponse {
    return SuccessResponse;
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify')
  verify() {
    // TODO: what does this function take in as input??
  }
}
