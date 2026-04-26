import mongoose from "mongoose";
import "./loadEnv.js";

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI missing. Atlas connection is required.");
  }

  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
    return;
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB Connected:", mongoose.connection.name);
};

export default connectDB;
