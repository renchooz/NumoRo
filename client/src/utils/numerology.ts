const reduceToSingleDigit = (num: number): number => {
  if (num <= 9) {
    return num;
  }

  const sum = num
    .toString()
    .split("")
    .reduce((acc, digit) => acc + Number(digit), 0);

  return reduceToSingleDigit(sum);
};

export const calculateMobileNumerology = (number: string) => {
  const digits = number
    .replace(/\D/g, "")
    .split("")
    .map((digit) => Number(digit));

  const mobileCompound = digits.reduce((sum, digit) => sum + digit, 0);
  const mobileFinal = reduceToSingleDigit(mobileCompound);

  return { mobileCompound, mobileFinal };
};
