const MASTER_NUMBERS = new Set([11, 22, 33]);
const VOWELS = new Set(["A", "E", "I", "O", "U"]);

const reduceNumber = (num) => {
  if (num <= 9 || MASTER_NUMBERS.has(num)) {
    return num;
  }

  const sum = num
    .toString()
    .split("")
    .reduce((acc, digit) => acc + Number(digit), 0);

  return reduceNumber(sum);
};

const getAlphabetValue = (char) => {
  const normalized = char.toUpperCase();
  const code = normalized.charCodeAt(0);
  if (code < 65 || code > 90) {
    return 0;
  }

  return ((code - 65) % 9) + 1;
};

const getLifePathNumber = (dob) => {
  const digits = dob.replace(/\D/g, "").split("");
  const total = digits.reduce((sum, digit) => sum + Number(digit), 0);
  return reduceNumber(total);
};

const getExpressionNumber = (name) => {
  const total = name
    .replace(/[^a-z]/gi, "")
    .split("")
    .reduce((sum, char) => sum + getAlphabetValue(char), 0);

  return reduceNumber(total);
};

const getSoulUrgeNumber = (name) => {
  const total = name
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .split("")
    .filter((char) => VOWELS.has(char))
    .reduce((sum, char) => sum + getAlphabetValue(char), 0);

  return reduceNumber(total || 1);
};

const getPersonalityNumber = (name) => {
  const total = name
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .split("")
    .filter((char) => !VOWELS.has(char))
    .reduce((sum, char) => sum + getAlphabetValue(char), 0);

  return reduceNumber(total || 1);
};

export {
  getLifePathNumber,
  getExpressionNumber,
  getSoulUrgeNumber,
  getPersonalityNumber,
  reduceNumber
};
