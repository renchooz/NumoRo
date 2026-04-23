export interface NumerologyRequest {
  fullName: string;
  dateOfBirth: string;
  mobileNumber: string;
  saveHistory?: boolean;
}

export interface NumberMeanings {
  pm: string;
  cn: string;
  dn: string;
}

export interface NumerologyResponse {
  _id?: string;
  fullName: string;
  dateOfBirth: string;
  mobileNumber: string;
  pm: number;
  cn: number;
  dn: number;
  meanings: NumberMeanings;
  createdAt?: string;
}
