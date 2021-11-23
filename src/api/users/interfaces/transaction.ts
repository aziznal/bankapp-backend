import { OtherPerson } from './other-person.interface';

export interface Transaction {
  action: 'SENT' | 'GOT';
  amount: number;
  date: Date;
  otherPerson: OtherPerson;
}
