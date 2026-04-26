import mongoose from "mongoose";
import crypto from "crypto";
import GridContent from "../models/GridContent.js";

const memoryStore = [];

const isDbConnected = () => mongoose.connection.readyState === 1;

const normalizeNumbers = (values) => {
  const parsed = (Array.isArray(values) ? values : [])
    .map((n) => Number(n))
    .filter((n) => Number.isInteger(n) && n >= 1 && n <= 9);
  const uniq = Array.from(new Set(parsed));
  uniq.sort((a, b) => a - b);
  return uniq;
};

const conflictInMemory = (candidate, exceptId) =>
  memoryStore.some(
    (entry) =>
      entry._id !== exceptId &&
      entry.gridType === candidate.gridType &&
      entry.type === candidate.type &&
      entry.numbers.join(",") === candidate.numbers.join(",")
  );

const nowIso = () => new Date().toISOString();

const toMemoryDoc = ({ gridType, type, numbers, englishContent = "", hindiContent = "" }) => ({
  _id: crypto.randomUUID(),
  gridType,
  type,
  numbers: normalizeNumbers(numbers),
  englishContent,
  hindiContent,
  createdAt: nowIso(),
  updatedAt: nowIso()
});

const sortByUpdatedDesc = (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();

const ensureMinNumbers = (numbers, res) => {
  if (!Array.isArray(numbers) || numbers.length < 2) {
    res.status(400).json({ message: "Minimum 2 numbers required" });
    return false;
  }
  return true;
};

export const createGridContent = async (req, res, next) => {
  try {
    const { gridType, type, numbers, englishContent = "", hindiContent = "" } = req.body ?? {};
    if (!ensureMinNumbers(numbers, res)) return;

    if (!isDbConnected()) {
      const doc = toMemoryDoc({ gridType, type, numbers, englishContent, hindiContent });
      if (conflictInMemory(doc)) {
        return res
          .status(409)
          .json({ message: "Entry for this gridType + type + numbers combination already exists" });
      }
      memoryStore.push(doc);
      return res.status(201).json(doc);
    }

    const doc = await GridContent.create({
      gridType,
      type,
      numbers,
      englishContent,
      hindiContent
    });

    res.status(201).json(doc);
  } catch (error) {
    // Unique index: { gridType, type, numbers }
    if (error?.code === 11000) {
      return res
        .status(409)
        .json({ message: "Entry for this gridType + type + numbers combination already exists" });
    }
    next(error);
  }
};

export const getAllGridContent = async (_req, res, next) => {
  try {
    if (!isDbConnected()) {
      const docs = [...memoryStore].sort(sortByUpdatedDesc);
      return res.status(200).json(docs);
    }
    const docs = await GridContent.find({}).sort({ updatedAt: -1 }).lean();
    res.status(200).json(docs);
  } catch (error) {
    next(error);
  }
};

export const getSingleGridContent = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isDbConnected()) {
      const doc = memoryStore.find((entry) => entry._id === id);
      if (!doc) {
        return res.status(404).json({ message: "Grid content not found" });
      }
      return res.status(200).json(doc);
    }
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
    const { id } = req.params;
    const { gridType, type, numbers, englishContent, hindiContent } = req.body ?? {};
    if (!ensureMinNumbers(numbers, res)) return;

    if (!isDbConnected()) {
      const index = memoryStore.findIndex((entry) => entry._id === id);
      if (index < 0) {
        return res.status(404).json({ message: "Grid content not found" });
      }

      const current = memoryStore[index];
      const updated = {
        ...current,
        gridType: gridType ?? current.gridType,
        type: type ?? current.type,
        numbers: normalizeNumbers(numbers ?? current.numbers),
        englishContent: englishContent ?? current.englishContent,
        hindiContent: hindiContent ?? current.hindiContent,
        updatedAt: nowIso()
      };

      if (conflictInMemory(updated, id)) {
        return res
          .status(409)
          .json({ message: "Entry for this gridType + type + numbers combination already exists" });
      }

      memoryStore[index] = updated;
      return res.status(200).json(updated);
    }

    const update = {};
    if (gridType != null) update.gridType = gridType;
    if (type != null) update.type = type;
    if (numbers != null) update.numbers = numbers;
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
        .json({ message: "Entry for this gridType + type + numbers combination already exists" });
    }
    next(error);
  }
};

export const deleteGridContent = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isDbConnected()) {
      const index = memoryStore.findIndex((entry) => entry._id === id);
      if (index < 0) {
        return res.status(404).json({ message: "Grid content not found" });
      }
      memoryStore.splice(index, 1);
      return res.status(200).json({ message: "Deleted" });
    }
    const deleted = await GridContent.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Grid content not found" });
    }
    res.status(200).json({ message: "Deleted" });
  } catch (error) {
    next(error);
  }
};

