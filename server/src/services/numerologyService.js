import NumerologyHistory from "../models/NumerologyHistory.js";
import { NUMBER_MEANINGS } from "../data/meanings.js";
import {
  getCompoundNumberFromDob,
  getDestinyNumberFromCompound,
  getPersonalityNumberFromDob
} from "../utils/numerology.js";

export const calculateNumerology = async ({ fullName, dateOfBirth, mobileNumber, saveHistory = true }) => {
  const pm = getPersonalityNumberFromDob(dateOfBirth);
  const cn = getCompoundNumberFromDob(dateOfBirth);
  const dn = getDestinyNumberFromCompound(cn);

  const payload = {
    fullName,
    dateOfBirth,
    mobileNumber,
    pm,
    cn,
    dn,
    meanings: {
      pm: NUMBER_MEANINGS[pm] || "Personality reveals your basic nature and personal style.",
      cn: "Compound Number reflects the full vibration of your birth date before final reduction.",
      dn: NUMBER_MEANINGS[dn] || "Destiny Number points to your life direction and purpose."
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
