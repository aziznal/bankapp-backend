import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SuccessResponse, TSuccessResponse } from 'src/common/success.response';

import { Registrant } from './interfaces/registrant.interface';

@Injectable()
export class RegisterService {
  constructor(@InjectModel('Register') private readonly registerModel: Model<Registrant>) {}

  /**
   * Creates a new user if one does not already exist with the given information
   *
   * @param {Registrant} newUser
   * @return {*}  {Promise<any>}
   * @memberof RegisterService
   */
  async create(newUser: Registrant): Promise<TSuccessResponse> {
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
   * @param {Registrant} user
   * @return {*}  {Promise<boolean>}
   * @memberof RegisterService
   */
  async checkAlreadyExists(user: Registrant): Promise<boolean> {
    const results = await this.registerModel.find({ email: user.email });
    return results.length > 0;
  }
}
