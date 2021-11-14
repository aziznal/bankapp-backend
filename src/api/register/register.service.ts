import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SuccessResponse, TSuccessResponse } from 'src/common/success.response';

import { User } from './interfaces/user.interface';

@Injectable()
export class RegisterService {
  constructor(@InjectModel('Register') private readonly registerModel: Model<User>) {}

  /**
   * Creates a new user if one does not already exist with the given information
   *
   * @param {User} newUser
   * @return {*}  {Promise<any>}
   * @memberof RegisterService
   */
  async create(newUser: User): Promise<TSuccessResponse> {
    const userAlreadyExists = await this.checkAlreadyExists(newUser);

    if (userAlreadyExists) {
      throw new ConflictException({ body: 'A User with the given email already exists!' });
    }

    const result = await this.registerModel.create(newUser);

    if (!result) {
      throw new InternalServerErrorException();
    }

    return SuccessResponse;
  }

  /**
   * Returns true if a user with the given user information is found in the database
   *
   * @param {User} user
   * @return {*}  {Promise<boolean>}
   * @memberof RegisterService
   */
  async checkAlreadyExists(user: User): Promise<boolean> {
    const results = await this.registerModel.find({ email: user.email });
    return results.length > 0;
  }
}
