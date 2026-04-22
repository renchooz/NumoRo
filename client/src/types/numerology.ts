export type GenderOption = "male" | "female" | "non-binary" | "prefer_not_to_say" | "";

export interface NumerologyRequest {
  fullName: string;
  dateOfBirth: string;
  gender?: GenderOption;
  saveHistory?: boolean;
}

export interface NumberMeanings {
  lifePath: string;
  expression: string;
  soulUrge: string;
  personality: string;
}

export interface NumerologyResponse {
  _id?: string;
  fullName: string;
  dateOfBirth: string;
  gender?: string;
  lifePathNumber: number;
  expressionNumber: number;
  soulUrgeNumber: number;
  personalityNumber: number;
  meanings: NumberMeanings;
  createdAt?: string;
}
