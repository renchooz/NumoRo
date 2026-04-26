import mongoose from "mongoose";
import GridContent from "../models/GridContent.js";

const ensureDb = () => {
  // connectDB() may continue without DB; surface a clean API error here.
  if (mongoose.connection.readyState !== 1) {
    const err = new Error("Database not connected (MONGODB_URI missing or unavailable).");
    // @ts-expect-error - attaching status for our error middleware
    err.statusCode = 503;
    throw err;
  }
};

export const createGridContent = async (req, res, next) => {
  try {
    ensureDb();
    const { gridType, number, englishContent = "", hindiContent = "" } = req.body ?? {};

    const doc = await GridContent.create({
      gridType,
      number,
      englishContent,
      hindiContent
    });

    res.status(201).json(doc);
  } catch (error) {
    // Unique index: { gridType, number }
    if (error?.code === 11000) {
      return res.status(409).json({ message: "Entry for this gridType + number already exists" });
    }
    next(error);
  }
};

export const getAllGridContent = async (_req, res, next) => {
  try {
    ensureDb();
    const docs = await GridContent.find({}).sort({ updatedAt: -1 }).lean();
    res.status(200).json(docs);
  } catch (error) {
    next(error);
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
    next(error);
  }
};

export const updateGridContent = async (req, res, next) => {
  try {
    ensureDb();
    const { id } = req.params;
    const { gridType, number, englishContent, hindiContent } = req.body ?? {};

    const update = {};
    if (gridType != null) update.gridType = gridType;
    if (number != null) update.number = number;
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
      return res.status(409).json({ message: "Entry for this gridType + number already exists" });
    }
    next(error);
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
    next(error);
  }
};

