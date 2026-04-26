import mongoose from "mongoose";
import "./loadEnv.js";

const syncGridContentIndexes = async () => {
  const collection = mongoose.connection.db.collection("gridcontents");

  try {
    await collection.dropIndex("gridType_1_type_1_numbers_1");
    console.log("Dropped legacy index: gridType_1_type_1_numbers_1");
  } catch (error) {
    if (error?.codeName !== "IndexNotFound") {
      console.warn("Index cleanup warning:", error.message);
    }
  }

  await collection.createIndex(
    { gridType: 1, type: 1, numbersKey: 1 },
    { unique: true, name: "gridType_1_type_1_numbersKey_1" }
  );
};

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
  await syncGridContentIndexes();
};

export default connectDB;
