import NumerologyHistory from "../models/NumerologyHistory.js";
import { NUMBER_MEANINGS } from "../data/meanings.js";
import {
  getExpressionNumber,
  getLifePathNumber,
  getPersonalityNumber,
  getSoulUrgeNumber
} from "../utils/numerology.js";

export const calculateNumerology = async ({ fullName, dateOfBirth, gender, saveHistory = true }) => {
  const lifePathNumber = getLifePathNumber(dateOfBirth);
  const expressionNumber = getExpressionNumber(fullName);
  const soulUrgeNumber = getSoulUrgeNumber(fullName);
  const personalityNumber = getPersonalityNumber(fullName);

  const payload = {
    fullName,
    dateOfBirth,
    gender: gender || "",
    lifePathNumber,
    expressionNumber,
    soulUrgeNumber,
    personalityNumber,
    meanings: {
      lifePath: NUMBER_MEANINGS[lifePathNumber],
      expression: NUMBER_MEANINGS[expressionNumber],
      soulUrge: NUMBER_MEANINGS[soulUrgeNumber],
      personality: NUMBER_MEANINGS[personalityNumber]
    }
  };

  if (saveHistory) {
    try {
      await NumerologyHistory.create(payload);
    } catch (error) {
      console.warn("History could not be saved:", error.message);
    }
  }

  return payload;
};

export const fetchRecentHistory = async () => {
  try {
    return await NumerologyHistory.find().sort({ createdAt: -1 }).limit(10).lean();
  } catch (error) {
    console.warn("History fetch skipped:", error.message);
    return [];
  }
};
