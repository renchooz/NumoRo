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

export {
  reduceToSingleDigit,
  getPersonalityNumberFromDob,
  getCompoundNumberFromDob,
  getDestinyNumberFromCompound
};
