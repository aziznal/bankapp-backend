import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { SuccessResponse, TSuccessResponse } from 'src/common/success.response';

import { Registrant } from './interfaces/registrant.interface';
import { User } from './interfaces/user.interface';

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
  constructor(
    private jwtService: JwtService,
    @InjectModel('Register') private readonly registerModel: Model<Registrant>,
    @InjectModel('Login') private readonly loginModel: Model<User>,
  ) {}

  async getUserByEmail(email: string): Promise<User | undefined> {
    return (await this.loginModel.findOne({ email: email })).toObject();
  }

  /**
   * Validates user using their email and password
   *
   * @param {string} email
   * @param {string} password
   * @return {*}  {Promise<any>}
   * @memberof AuthService
   */
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.getUserByEmail(email);

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
  async login(user: User): Promise<{ access_token: string }> {
    console.log('auth service:');
    console.log(user);
    const payload = { email: user.email, sub: user._id, fullname: user.fullname };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * Creates a new user if one does not already exist with the given information
   *
   * @param {Registrant} newUser
   * @return {*}  {Promise<any>}
   * @memberof AuthService
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
   * @memberof AuthService
   */
  async checkAlreadyExists(user: Registrant): Promise<boolean> {
    const results = await this.registerModel.find({ email: user.email });
    return results.length > 0;
  }
}
