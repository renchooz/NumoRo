import mongoose from "mongoose";

const gridContentSchema = new mongoose.Schema(
  {
    gridType: {
      type: String,
      required: true,
      enum: ["loshu", "pythagoras", "vedic"],
      index: true
    },
    number: {
      type: Number,
      required: true,
      min: 1,
      max: 9,
      index: true
    },
    englishContent: {
      type: String,
      default: ""
    },
    hindiContent: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

gridContentSchema.index({ gridType: 1, number: 1 }, { unique: true });

const GridContent = mongoose.model("GridContent", gridContentSchema);

export default GridContent;

