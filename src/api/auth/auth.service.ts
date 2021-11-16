import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SuccessResponse, TSuccessResponse } from 'src/common/success.response';
import { User } from '../users/interfaces/user.interface';
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
  constructor(@InjectModel('Login') private readonly loginModel: Model<ILogin>, private usersService: UsersService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = this.usersService.getUserByEmail(email);

    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }
}
