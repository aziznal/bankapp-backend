import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SuccessResponse, TSuccessResponse } from 'src/common/success.response';

import { ILogin } from './interfaces/login.interface';

@Injectable()
export class AuthService {
  /**
   * Creates an instance of AuthService.
   *
   * @param {Model<ILogin>} loginModel
   * @memberof AuthService
   */
  constructor(@InjectModel('Login') private readonly loginModel: Model<ILogin>) {}

  /**
   * Attempts to log user in
   *
   * @param {ILogin} loginData
   * @return {*}  {Promise<TSuccessResponse>}
   * @memberof AuthService
   */
  async login(loginData: ILogin): Promise<TSuccessResponse> {
    const result = await this.loginModel.findOne({
      email: loginData.email,
      password: loginData.password,
    });

    if (!result) {
      throw new NotFoundException({
        body: 'No user was found with the given email/password combination',
      });
    }

    return SuccessResponse;
  }
}
