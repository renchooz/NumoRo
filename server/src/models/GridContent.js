import mongoose from "mongoose";

const gridContentSchema = new mongoose.Schema(
  {
    gridType: {
      type: String,
      required: true,
      enum: ["loshu", "pythagoras", "vedic"],
      index: true
    },
    numbers: {
      type: [Number],
      required: true,
      validate: {
        validator(value) {
          if (!Array.isArray(value) || value.length < 2) return false;
          return value.every((n) => Number.isInteger(n) && n >= 1 && n <= 9);
        },
        message: "numbers must contain at least 2 integers between 1 and 9"
      }
    },
    type: {
      type: String,
      required: true,
      enum: ["present", "missing"],
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

function normalizeNumbers(values) {
  const parsed = (Array.isArray(values) ? values : [])
    .map((n) => Number(n))
    .filter((n) => Number.isInteger(n) && n >= 1 && n <= 9);
  const uniq = Array.from(new Set(parsed));
  uniq.sort((a, b) => a - b);
  return uniq;
}

gridContentSchema.pre("validate", function () {
  // Canonicalize combination so uniqueness works predictably.
  // eslint-disable-next-line no-invalid-this
  this.numbers = normalizeNumbers(this.numbers);
});

gridContentSchema.index({ gridType: 1, type: 1, numbers: 1 }, { unique: true });

const GridContent = mongoose.model("GridContent", gridContentSchema);

export default GridContent;

