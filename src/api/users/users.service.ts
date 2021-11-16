import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';

const mockUsers: User[] = [
  {
    id: '1',
    email: 'johndoe@gmail.com',
    password: 'joe',
    fullname: 'John Doe',
  },
  {
    id: '2',
    email: 'janedoe@gmail.com',
    password: 'jane',
    fullname: 'Jane Doe',
  },
];

@Injectable()
export class UsersService {
  constructor() {}

  getUserByEmail(email: string): User | undefined {
    return mockUsers.find((user) => user.email === email);
  }
}
