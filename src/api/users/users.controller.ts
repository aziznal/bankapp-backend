import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { UsersService } from './users.service';

import { SimplifiedTransaction } from './interfaces/simplified-transaction.interface';
import { Transaction } from './interfaces/transaction';
import { User } from './interfaces/user.interface';
import { BankingAccount } from './interfaces/banking-account.interface';

/**
 * Controller for handling user-data related requests
 *
 * @export
 * @class UsersController
 */
@UseGuards(JwtAuthGuard)
@Controller('u')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * Returns a full user object with all the account and
   *
   * @param {{ user: User }} req
   * @return {*}  {(Promise<User | any>)}
   * @memberof UsersController
   */
  @Get()
  async getUserData(@Request() req: { user: User }): Promise<User | any> {
    const { password, ...user } = await this.usersService.getUserByEmail(req.user.email);
    return user;
  }

  /**
   * Returns an array of all user accounts
   *
   * @param {{ user: User }} req
   * @return {*}
   * @memberof UsersController
   */
  @Get('accounts')
  getAccounts(@Request() req: { user: User }): Promise<BankingAccount[]> {
    return this.usersService.getAccounts(req.user.email);
  }

  /**
   * Returns array of user transactions. This array can either be full
   * Transaction objects or simplified transactions for use with charts etc.
   *
   * @param {{ user: User }} req
   * @param {({ forChart: 'true' | 'false' })} query
   * @return {*}  {(Promise<Transaction[] | SimplifiedTransaction[]>)}
   * @memberof UsersController
   */
  @Get('transactions')
  getTransactions(
    @Request() req: { user: User },
    @Query() query: { forChart: 'true' | 'false' },
  ): Promise<Transaction[] | SimplifiedTransaction[]> {
    if (query.forChart && query.forChart === 'true') {
      return this.usersService.getTransactionsForChart(req.user.email);
    } else {
      return this.usersService.getTransactions(req.user.email);
    }
  }
}
