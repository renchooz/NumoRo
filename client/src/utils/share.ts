import type { NumerologyResponse } from "../types/numerology";

export const shareResult = async (result: NumerologyResponse) => {
  const text = [
    `Numerology for ${result.fullName}`,
    `Personality Number (PM): ${result.pm}`,
    `Compound Number (CN): ${result.cn}`,
    `Destiny Number (DN): ${result.dn}`,
    `Name Compound Number (NCN): ${result.nameCompound}`,
    `Final Name Number: ${result.nameFinal}`
  ].join("\n");

  if (navigator.share) {
    await navigator.share({ title: "My Numerology Result", text });
    return;
  }

  await navigator.clipboard.writeText(text);
};
