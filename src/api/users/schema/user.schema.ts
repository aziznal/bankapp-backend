import { Schema } from 'mongoose';

export const UserSchema = new Schema(
  {
    fullname: String,
    password: String,
    email: { type: String, unique: true },
    birthdate: Date,
    phoneNumber: String,
    debt: Number,

    accounts: {
      type: [
        {
          label: { type: String, unique: true },
          balance: Number,

          transactions: {
            type: [
              {
                action: String,
                amount: Number,
                date: Date,
                otherPerson: {
                  type: {
                    fullname: String,
                    email: String,
                    accountId: String,
                  },
                },
              },
            ],
            default: [],
          },
        },
      ],
      default: [],
    },
  },
  {
    collection: 'users',
  },
);
