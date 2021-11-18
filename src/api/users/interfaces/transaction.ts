import { OtherPerson } from './other-person.interface';

export interface Transaction {
  _id: string;
  action: 'SENT' | 'GOT';
  amount: number;
  date: Date;
  otherPerson: OtherPerson;
}
