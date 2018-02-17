import { PersonSchema, IPersonDocument } from './Person';
import { Document, Schema, Model, model } from 'mongoose';

export interface IUserDocument extends Document {
  created: number;
  nickname: string;
  password: string;
  persons: IPersonDocument[];
}

const UserSchema = new Schema({
  created: { type: Date, default: Date.now() },
  nickname: String,
  password: String,
  persons: [ PersonSchema ],
});

export const User: Model<IUserDocument> = model<IUserDocument>(
  'User',
  UserSchema,
);
