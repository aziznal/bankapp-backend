import { BankingAccount } from './banking-account.interface';

export interface User {
  _id: string;
  fullname: string;
  email: string;
  password: string;
  debt?: number;
  birthdate?: string;
  phoneNumber?: string;

  accounts: BankingAccount[];
}
