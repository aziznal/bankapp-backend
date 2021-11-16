import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

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
  constructor(configService: ConfigService) {
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
    return { id: payload.id, email: payload.email, fullname: payload.fullname };
  }
}
