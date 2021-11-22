import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from './interfaces/transaction';
import { User } from './interfaces/user.interface';

import * as _ from 'lodash';
import { Utils } from 'src/common/utils';
import { OtherPerson } from './interfaces/other-person.interface';
import { SimplifiedTransaction } from './interfaces/simplified-transaction.interface';
import { BankingAccount } from './interfaces/banking-account.interface';
import { NewBankingAccountDto } from './dto/new-banking-account-dto';
import { SuccessResponse, TSuccessResponse } from 'src/common/success.response';
import { EditBankingAccountDto } from './dto/edit-banking-account-dto';
import { DeleteBankingAccountDto } from './dto/delete-banking-account-dto';

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

    if (flatTransactions.length < 1) {
      return [];
    }

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

  /**
   * Creates a new banking account for the user
   *
   * @param {string} email
   * @param {NewBankingAccountDto} newBankingAccountDto
   * @return {*}  {Promise<TSuccessResponse>}
   * @memberof UsersService
   */
  async createNewBankingAccount(
    email: string,
    newBankingAccountDto: NewBankingAccountDto,
  ): Promise<TSuccessResponse> {
    const user = await this.getUserByEmail(email);

    // Make sure the provided label in the dto does not already exists
    if (user.accounts.some((account) => account.label === newBankingAccountDto.label)) {
      throw new ConflictException('The provided label is already in use by another account');
    }

    const newBankingAccount: BankingAccount = {
      balance: 0,
      label: newBankingAccountDto.label,
      transactions: [] as Transaction[],
    };

    let result = await this.userModel.updateOne(
      { email: email },
      {
        accounts: [...user.accounts, newBankingAccount],
      },
    );

    if (result.modifiedCount < 1) {
      throw new InternalServerErrorException('Server side exception occured.');
    }

    return SuccessResponse;
  }

  /**
   * Allows user to change the label of an account
   *
   * @param {string} email
   * @param {EditBankingAccountDto} editBankingAccountDto
   * @return {*}  {Promise<TSuccessResponse>}
   * @memberof UsersService
   */
  async updateBankingAccount(
    email: string,
    editBankingAccountDto: EditBankingAccountDto,
  ): Promise<TSuccessResponse> {
    const user = await this.getUserByEmail(email);

    // Confirm that an account with the old label already exists
    if (!user.accounts.some((account) => account.label === editBankingAccountDto.oldLabel)) {
      throw new NotFoundException(
        `No accounts were found with the label '${editBankingAccountDto.oldLabel}'`,
      );
    }

    // Confirm that given new label is not already in use
    if (user.accounts.some((account) => account.label === editBankingAccountDto.newLabel)) {
      throw new ConflictException(
        `An account already exists with the label '${editBankingAccountDto.newLabel}'`,
      );
    }

    // update old label to new label
    user.accounts.find((account) => account.label === editBankingAccountDto.oldLabel).label =
      editBankingAccountDto.newLabel;

    const result = await this.userModel.updateOne(
      { email: email },
      {
        accounts: user.accounts,
      },
    );

    if (result.modifiedCount < 1) {
      throw new InternalServerErrorException(
        'Server-side exception occured. could not update banking account details',
      );
    }

    return SuccessResponse;
  }

  /**
   * Deletes account based on given label
   *
   * @param {string} email
   * @param {DeleteBankingAccountDto} deleteBankingAccountDto
   * @return {*}  {Promise<TSuccessResponse>}
   * @memberof UsersService
   */
  async deleteBankingAccount(
    email: string,
    deleteBankingAccountDto: DeleteBankingAccountDto,
  ): Promise<TSuccessResponse> {
    const user = await this.getUserByEmail(email);

    // Check user has account to be deleted
    if (!user.accounts.some((account) => account.label === deleteBankingAccountDto.label)) {
      throw new NotFoundException('No account with the given label exists for given user');
    }

    user.accounts = user.accounts.filter(
      (account) => account.label !== deleteBankingAccountDto.label,
    );

    const result = await this.userModel.updateOne(
      { email: email },
      {
        accounts: user.accounts,
      },
    );

    if (result.modifiedCount < 1) {
      throw new InternalServerErrorException('Server-side error. Could not delete account');
    }

    return SuccessResponse;
  }
}
