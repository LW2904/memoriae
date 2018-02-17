import { Document, Schema, Model, model } from 'mongoose';

export interface IPersonDocument extends Document {
  firstName: string;
  middleNames: [ string ];
  lastName: string;
  notes: string;
  birthday: number;
}

export const PersonSchema = new Schema({
  firstName: String,
  middleNames: { type: [ String ], default: [] },
  lastName: String,
  notes: String,
  birthday: { type: Date, default: 0 },
});

export const Person: Model<IPersonDocument> = model<IPersonDocument>(
  'Person',
  PersonSchema,
);
