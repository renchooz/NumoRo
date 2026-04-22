import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env", override: true });
const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.warn("MONGODB_URI missing. Running without database.");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn("MongoDB connection error. Continuing without database:", error.message);
  }
};

export default connectDB;
