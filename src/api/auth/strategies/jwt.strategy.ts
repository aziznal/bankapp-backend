import { Injectable } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { jwtConstants } from '../constants';
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
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
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
