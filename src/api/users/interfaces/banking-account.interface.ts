import { Transaction } from "./transaction";

export interface BankingAccount {
  _id?: string;
  label: string;
  balance: number;

  transactions?: Transaction[];
}