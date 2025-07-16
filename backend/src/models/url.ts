import mongoose, { Document, Model, Schema } from "mongoose";

export interface URLMapping extends Document {
  originalURL: string;
  shortURL: string;
  ownerUserId: mongoose.Types.ObjectId;
  click_count: number;
  qrCode?: string
}

export const urlSchema: Schema<URLMapping> = new Schema({
  originalURL: {
    type: String,
    required: true
  },
  shortURL: {
    type: String,
    required: true,
    unique: true
  },
  click_count: {
    type: Number,
    required: true,
    default: 0
  },
  ownerUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  qrCode: {
    type: String,
    default: ""
  }
})

export const Url: Model<URLMapping> = mongoose.model<URLMapping>("url", urlSchema)