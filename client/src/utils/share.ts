import type { NumerologyResponse } from "../types/numerology";

export const shareResult = async (result: NumerologyResponse) => {
  const text = [
    `Numerology for ${result.fullName}`,
    `Life Path: ${result.lifePathNumber}`,
    `Expression: ${result.expressionNumber}`,
    `Soul Urge: ${result.soulUrgeNumber}`,
    `Personality: ${result.personalityNumber}`
  ].join("\n");

  if (navigator.share) {
    await navigator.share({ title: "My Numerology Result", text });
    return;
  }

  await navigator.clipboard.writeText(text);
};
