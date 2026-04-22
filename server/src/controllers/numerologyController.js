import { validationResult } from "express-validator";
import { calculateNumerology, fetchRecentHistory } from "../services/numerologyService.js";

export const postCalculate = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }

    const result = await calculateNumerology(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

export const getHistory = async (_req, res, next) => {
  try {
    const history = await fetchRecentHistory();
    return res.status(200).json(history);
  } catch (error) {
    return next(error);
  }
};
