import mongoose from "mongoose";

const numerologyHistorySchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    middleName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    fullName: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    pm: { type: Number, required: true },
    cn: { type: Number, required: true },
    dn: { type: Number, required: true },
    nameCompound: { type: Number, required: true },
    nameFinal: { type: Number, required: true },
    mobileCompound: { type: Number, required: true },
    mobileFinal: { type: Number, required: true }
  },
  { timestamps: true }
);

const NumerologyHistory = mongoose.model("NumerologyHistory", numerologyHistorySchema);

export default NumerologyHistory;
