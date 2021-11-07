import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ILogin } from './interfaces/login.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Login') private readonly loginModel: Model<ILogin>,
  ) {}

  async login(loginData: ILogin) {
    return await this.loginModel.findOne({
      email: loginData.email,
      password: loginData.password,
    });
  }
}
