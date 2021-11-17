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
          label: String,
          currency: String,
          balance: Number,

          transactions: {
            type: [
              {
                action: String,
                amount: Number,
                date: Date,
                otherPerson: {
                  type: {
                    _id: String,
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
