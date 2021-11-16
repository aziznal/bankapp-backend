import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

import { SuccessResponse, TSuccessResponse } from 'src/common/success.response';
import { DecodedJwt } from './interfaces/decoded-jwt.interface';

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
  login(@Request() req: { user: DecodedJwt }) {
    return this.authService.login(req.user);
  }

  /**
   * Verifies incoming request using JWT
   *
   * @return {*}  {TSuccessResponse}
   * @memberof AuthController
   */
  @UseGuards(JwtAuthGuard)
  @Get('verify')
  verify(): TSuccessResponse {
    // TODO: make this method extend the token expiry date.
    return SuccessResponse;
  }
}
