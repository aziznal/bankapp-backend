import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';

/**
 * Auth service used to validate user login and generate encoded jwt
 *
 * @export
 * @class AuthService
 */
@Injectable()
export class AuthService {
  /**
   * Creates an instance of AuthService.
   *
   * @param {UsersService} usersService
   * @param {JwtService} jwtService
   * @memberof AuthService
   */
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  /**
   * Validates user using their email and password
   *
   * @param {string} email
   * @param {string} password
   * @return {*}  {Promise<any>}
   * @memberof AuthService
   */
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.getUserByEmail(email);

    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  /**
   * Logs user in by returning a jwt
   *
   * @param {*} user
   * @return {*}  {Promise<{ access_token: string }>}
   * @memberof AuthService
   */
  async login(user: any): Promise<{ access_token: string }> {
    const payload = { email: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
