import { Schema } from 'mongoose';

export const LoginSchema = new Schema(
  {
    email: String,
    password: String,
  },
  {
    collection: 'users',
  },
);
