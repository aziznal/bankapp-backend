import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UsersService } from '../users/users.service';

import { ILogin } from './interfaces/login.interface';

@Injectable()
export class AuthService {
  /**
   * Creates an instance of AuthService.
   *
   * @param {Model<ILogin>} loginModel
   * @memberof AuthService
   */
  constructor(
    @InjectModel('Login') private readonly loginModel: Model<ILogin>,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = this.usersService.getUserByEmail(email);

    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
