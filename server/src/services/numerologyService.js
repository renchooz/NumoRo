import NumerologyHistory from "../models/NumerologyHistory.js";
import { NUMBER_MEANINGS } from "../data/meanings.js";
import {
  calculateMobileNumerology,
  calculateNameNumerology,
  getCompoundNumberFromDob,
  getDestinyNumberFromCompound,
  getPersonalityNumberFromDob
} from "../utils/numerology.js";

export const calculateNumerology = async ({
  firstName,
  middleName,
  lastName,
  dateOfBirth,
  mobileNumber,
  saveHistory = true
}) => {
  const fullName = [firstName, middleName, lastName].filter(Boolean).join(" ").trim();
  const pm = getPersonalityNumberFromDob(dateOfBirth);
  const cn = getCompoundNumberFromDob(dateOfBirth);
  const dn = getDestinyNumberFromCompound(cn);
  const { nameCompound, nameFinal } = calculateNameNumerology(fullName);
  const { mobileCompound, mobileFinal } = calculateMobileNumerology(mobileNumber);

  const payload = {
    firstName,
    middleName: middleName || "",
    lastName: lastName || "",
    fullName,
    dateOfBirth,
    mobileNumber,
    pm,
    cn,
    dn,
    nameCompound,
    nameFinal,
    mobileCompound,
    mobileFinal,
    meanings: {
      pm: NUMBER_MEANINGS[pm] || "Personality reveals your basic nature and personal style.",
      cn: "Compound Number reflects the full vibration of your birth date before final reduction.",
      dn: NUMBER_MEANINGS[dn] || "Destiny Number points to your life direction and purpose.",
      nameCompound: "Name Compound Number is the raw total vibration of your complete name.",
      nameFinal: NUMBER_MEANINGS[nameFinal] || "Final Name Number shows your core name vibration.",
      mobileCompound: "Mobile Compound Number is the total of all digits in your mobile number.",
      mobileFinal: NUMBER_MEANINGS[mobileFinal] || "Final Mobile Number shows the core vibration of your mobile number."
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
