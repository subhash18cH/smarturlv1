import mongoose from "mongoose";

export const connectToDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string)
    console.log("db connected");
  } catch (error) {
    console.log(error);
  }
}