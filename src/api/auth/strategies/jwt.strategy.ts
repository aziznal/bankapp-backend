import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

import { DecodedJwt } from '../interfaces/decoded-jwt.interface';

/**
 * login strategy using jwt
 *
 * @export
 * @class JwtStrategy
 * @extends {PassportStrategy(Strategy)}
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Creates an instance of JwtStrategy.
   *
   * @memberof JwtStrategy
   */
  constructor(configService: ConfigService, private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
    });
  }

  /**
   * very basic method that simply returns the jwt payload
   *
   * @param {*} payload
   * @return {*}  {Promise<DecodedJwt>}
   * @memberof JwtStrategy
   */
  async validate(payload: DecodedJwt): Promise<DecodedJwt> {
    const authorized = await this.authService.validateJwt(payload.email, payload);

    if (!authorized) {
      throw new UnauthorizedException();
    }

    return { sub: payload.sub, email: payload.email, fullname: payload.fullname };
  }
}
