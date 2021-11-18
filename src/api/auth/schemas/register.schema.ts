import { Schema } from 'mongoose';

export const RegisterSchema = new Schema(
  {
    fullname: String,
    email: { type: String, unique: true },
    password: String,
    birthdate: Date,
    phoneNumber: String,
  },
  {
    collection: 'users',
  },
);
