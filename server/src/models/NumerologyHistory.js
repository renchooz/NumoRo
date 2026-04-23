import mongoose from "mongoose";

const numerologyHistorySchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    pm: { type: Number, required: true },
    cn: { type: Number, required: true },
    dn: { type: Number, required: true }
  },
  { timestamps: true }
);

const NumerologyHistory = mongoose.model("NumerologyHistory", numerologyHistorySchema);

export default NumerologyHistory;
