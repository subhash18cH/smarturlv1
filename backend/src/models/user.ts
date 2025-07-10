import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  userName: string;
  email: string;
  password: string
}

export const userSchema: Schema<IUser> = new Schema({
  userName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
})

export const User: Model<IUser> = mongoose.model<IUser>("user", userSchema)