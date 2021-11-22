import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from './interfaces/transaction';
import { User } from './interfaces/user.interface';

import * as _ from 'lodash';
import { Utils } from 'src/common/utils';
import { OtherPerson } from './interfaces/other-person.interface';
import { SimplifiedTransaction } from './interfaces/simplified-transaction.interface';
import { BankingAccount } from './interfaces/banking-account.interface';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async getUserByEmail(email: string): Promise<User | undefined> {
    return (await this.userModel.findOne({ email: email })).toObject();
  }

  async getAccounts(email: string): Promise<BankingAccount[]> {
    const user = await this.getUserByEmail(email);
    return user.accounts;
  }

  /**
   * Returns array of transactions that happened in all accounts
   *
   * @param {string} email
   * @return {*}  {Promise<Transaction[]>}
   * @memberof UsersService
   */
  async getTransactions(email: string): Promise<Transaction[]> {
    const user = await this.getUserByEmail(email);
    const transactionArrays = user.accounts.map((account) => account.transactions);
    return transactionArrays.flat();
  }

  /**
   * Returns a sorted array of transactions where transactions in the same date
   * are added together.
   *
   * @param {{ [date: string]: Transaction[] }} groupedTransactions
   * @return {*}
   * @memberof UsersService
   */
  private getSummedTransactions(groupedTransactions: {
    [date: string]: Transaction[];
  }): Transaction[] {
    let summedTransactions = [] as Transaction[];

    Object.keys(groupedTransactions).forEach((groupKey) => {
      summedTransactions.push(
        groupedTransactions[groupKey].reduce((prev, current) => {
          // REFACTOR: make a method to add two transactions
          return {
            ...prev,
            amount: prev.amount + (current.action === 'SENT' ? -current.amount : current.amount),
          };
        }),
      );
    });

    // Sort transactions by date
    return summedTransactions.sort((a, b) => a.date.valueOf() - b.date.valueOf());
  }

  /**
   * Returns range of dates (where steps are 1 day between each date) for each
   * missing day in the given transactions
   *
   * @private
   * @param {Transaction[]} summedTransactions
   * @return {*}  {Date[]}
   * @memberof UsersService
   */
  private getMissingDateRange(summedTransactions: Transaction[]): Date[] {
    // TODO: test with empty range
    // TODO: test with one empty date

    // Get earliest date.
    const earliestTransaction = new Date(
      Math.min(...summedTransactions.map((transaction) => transaction.date.valueOf())),
    );

    const latestTransaction = new Date(
      Math.max(...summedTransactions.map((transaction) => transaction.date.valueOf())),
    );

    const dates = Utils.dateRange(earliestTransaction, latestTransaction, 1).filter(
      (date) =>
        !summedTransactions.some(
          (transaction) =>
            Utils.getYearMonthDate(transaction.date) === Utils.getYearMonthDate(date),
        ),
    );

    return dates;
  }

  /**
   * Returns array of simplified transactions for use with charts and graphs
   *
   * @param {string} email
   * @return {*}  {Promise<SimplifiedTransaction[]>}
   * @memberof UsersService
   */
  async getTransactionsForChart(email: string): Promise<SimplifiedTransaction[]> {
    const flatTransactions = await this.getTransactions(email);

    // Group transactions that happened on the same day
    const groupedTransactions = _.groupBy(flatTransactions, (transaction) =>
      transaction.date.valueOf(),
    );

    // Add transactions in each group together
    const summedTransactions = this.getSummedTransactions(groupedTransactions);

    // Add Empty Transaction for days with no transactions
    const missingDates = this.getMissingDateRange(summedTransactions);

    missingDates.forEach((date) => {
      summedTransactions.push({
        _id: Math.random().toString(),
        action: 'GOT',
        amount: 0,
        date: date,
        otherPerson: {} as OtherPerson,
      });
    });

    // Sort and Simplify data format
    const finalTransactions = summedTransactions.map((transaction) => {
      return {
        amount: transaction.action === 'SENT' ? -transaction.amount : transaction.amount,
        date: transaction.date,
      };
    });

    // Sorting is important to make sure latest transactions are included in the 14 day range
    finalTransactions.sort((a, b) => a.date.valueOf() - b.date.valueOf());

    // Return last 14 days at most
    return finalTransactions.length > 14
      ? finalTransactions.slice(finalTransactions.length - 14)
      : finalTransactions;
  }
}
