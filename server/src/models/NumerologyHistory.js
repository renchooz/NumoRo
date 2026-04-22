import mongoose from "mongoose";

const numerologyHistorySchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    gender: { type: String, default: "" },
    lifePathNumber: { type: Number, required: true },
    expressionNumber: { type: Number, required: true },
    soulUrgeNumber: { type: Number, required: true },
    personalityNumber: { type: Number, required: true }
  },
  { timestamps: true }
);

const NumerologyHistory = mongoose.model("NumerologyHistory", numerologyHistorySchema);

export default NumerologyHistory;
