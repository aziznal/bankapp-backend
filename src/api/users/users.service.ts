import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async getUserByEmail(email: string): Promise<User | undefined> {
    return (await this.userModel.findOne({ email: email })).toObject();
  }
}