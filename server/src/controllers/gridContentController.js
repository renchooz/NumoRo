import mongoose from "mongoose";
import GridContent from "../models/GridContent.js";

const ensureDb = () => {
  if (mongoose.connection.readyState !== 1) {
    const err = new Error("Database not connected (MONGO_URI missing or unavailable).");
    // @ts-expect-error attaching status for middleware usage
    err.statusCode = 503;
    throw err;
  }
};

const ensureMinNumbers = (numbers, res) => {
  if (!Array.isArray(numbers) || numbers.length < 2) {
    res.status(400).json({ success: false, message: "Invalid input" });
    return false;
  }
  return true;
};

const normalizeNumbers = (values) => {
  const parsed = (Array.isArray(values) ? values : [])
    .map((n) => Number(n))
    .filter((n) => Number.isInteger(n) && n >= 1 && n <= 9);
  const uniq = Array.from(new Set(parsed));
  uniq.sort((a, b) => a - b);
  return uniq;
};

export const createGridContent = async (req, res, next) => {
  try {
    ensureDb();
    const { gridType, type, numbers, englishContent = "", hindiContent = "" } = req.body ?? {};
    if (!gridType || !type || typeof englishContent !== "string" || typeof hindiContent !== "string") {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }
    if (!ensureMinNumbers(numbers, res)) return;
    if (!Array.isArray(numbers)) {
      return res.status(400).json({ success: false, message: "numbers must be an array" });
    }

    // Normalize once and use consistently for query + save.
    const normalizedNumbers = normalizeNumbers(numbers);
    console.log("Incoming numbers:", numbers);
    console.log("Normalized:", normalizedNumbers);
    const numbersKey = normalizedNumbers.join(",");

    const existing = await GridContent.findOne({
      gridType,
      type,
      numbersKey
    }).lean();

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Entry for this gridType + type + numbers combination already exists"
      });
    }

    const doc = await GridContent.create({
      gridType,
      type,
      numbers: normalizedNumbers,
      englishContent,
      hindiContent
    });

    res.status(201).json(doc);
  } catch (error) {
    // Unique index: { gridType, type, numbers }
    if (error?.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: "Entry for this gridType + type + numbers combination already exists" });
    }
    console.error("GRID CONTENT ERROR:", error.message);
    return res.status(error?.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

export const getAllGridContent = async (_req, res, next) => {
  try {
    ensureDb();
    const docs = await GridContent.find({}).sort({ updatedAt: -1 }).lean();
    res.status(200).json(docs);
  } catch (error) {
    console.error("GRID CONTENT ERROR:", error.message);
    return res.status(error?.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

export const getSingleGridContent = async (req, res, next) => {
  try {
    ensureDb();
    const { id } = req.params;
    const doc = await GridContent.findById(id).lean();
    if (!doc) {
      return res.status(404).json({ message: "Grid content not found" });
    }
    res.status(200).json(doc);
  } catch (error) {
    console.error("GRID CONTENT ERROR:", error.message);
    return res.status(error?.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

export const updateGridContent = async (req, res, next) => {
  try {
    ensureDb();
    const { id } = req.params;
    const { gridType, type, numbers, englishContent, hindiContent } = req.body ?? {};
    if (!gridType || !type || typeof englishContent !== "string" || typeof hindiContent !== "string") {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }
    if (!ensureMinNumbers(numbers, res)) return;
    if (!Array.isArray(numbers)) {
      return res.status(400).json({ success: false, message: "numbers must be an array" });
    }

    const normalizedNumbers = normalizeNumbers(numbers);
    console.log("Incoming numbers:", numbers);
    console.log("Normalized:", normalizedNumbers);
    const numbersKey = normalizedNumbers.join(",");

    const existing = await GridContent.findOne({
      _id: { $ne: id },
      gridType,
      type,
      numbersKey
    }).lean();

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Entry for this gridType + type + numbers combination already exists"
      });
    }

    const update = {};
    if (gridType != null) update.gridType = gridType;
    if (type != null) update.type = type;
    if (numbers != null) update.numbers = normalizedNumbers;
    if (englishContent != null) update.englishContent = englishContent;
    if (hindiContent != null) update.hindiContent = hindiContent;

    const updated = await GridContent.findByIdAndUpdate(
      id,
      update,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Grid content not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    if (error?.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: "Entry for this gridType + type + numbers combination already exists" });
    }
    console.error("GRID CONTENT ERROR:", error.message);
    return res.status(error?.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

export const deleteGridContent = async (req, res, next) => {
  try {
    ensureDb();
    const { id } = req.params;
    const deleted = await GridContent.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Grid content not found" });
    }
    res.status(200).json({ message: "Deleted" });
  } catch (error) {
    console.error("GRID CONTENT ERROR:", error.message);
    return res.status(error?.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

