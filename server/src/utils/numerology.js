const reduceToSingleDigit = (num) => {
  if (num <= 9) {
    return num;
  }

  const sum = num
    .toString()
    .split("")
    .reduce((acc, digit) => acc + Number(digit), 0);

  return reduceToSingleDigit(sum);
};

const NAME_NUMEROLOGY_MAP = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8
};

const parseDob = (dateOfBirth) => {
  const [day, month, year] = dateOfBirth.split("-").map((part) => Number(part));
  return { day, month, year };
};

const getPersonalityNumberFromDob = (dateOfBirth) => {
  const { day } = parseDob(dateOfBirth);
  return reduceToSingleDigit(day);
};

const getCompoundNumberFromDob = (dateOfBirth) => {
  return dateOfBirth
    .replace(/\D/g, "")
    .split("")
    .reduce((sum, digit) => sum + Number(digit), 0);
};

const getDestinyNumberFromCompound = (compoundNumber) => {
  return reduceToSingleDigit(compoundNumber);
};

const calculateNameNumerology = (name) => {
  const normalized = name.toUpperCase().replace(/\s+/g, "");
  const compound = normalized.split("").reduce((sum, char) => sum + (NAME_NUMEROLOGY_MAP[char] || 0), 0);
  const final = reduceToSingleDigit(compound);
  return { nameCompound: compound, nameFinal: final };
};

export {
  reduceToSingleDigit,
  getPersonalityNumberFromDob,
  getCompoundNumberFromDob,
  getDestinyNumberFromCompound,
  calculateNameNumerology
};
