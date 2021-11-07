import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';

@Injectable()
export class RegisterService {
  constructor(
    @InjectModel('Register') private readonly registerModel: Model<User>,
  ) {}

  async createUser(newUser: User) {
    return await this.registerModel.create(newUser);
  }
}
