import mongoose from "mongoose";
import "./loadEnv.js";

let retryTimer = null;

const clearRetryTimer = () => {
  if (retryTimer) {
    clearTimeout(retryTimer);
    retryTimer = null;
  }
};

const scheduleRetry = () => {
  if (retryTimer) return;
  retryTimer = setTimeout(async () => {
    retryTimer = null;
    await connectDB();
  }, 10_000);
};

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.warn("MONGODB_URI missing. Running without database.");
    return;
  }

  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    clearRetryTimer();
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn("MongoDB connection error. Continuing without database:", error.message);
    scheduleRetry();
  }
};

export default connectDB;
