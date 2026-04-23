export interface NumerologyRequest {
  firstName: string;
  middleName?: string;
  lastName?: string;
  dateOfBirth: string;
  mobileNumber: string;
  saveHistory?: boolean;
}

export interface NumberMeanings {
  pm: string;
  cn: string;
  dn: string;
  nameCompound: string;
  nameFinal: string;
  mobileCompound: string;
  mobileFinal: string;
}

export interface NumerologyResponse {
  _id?: string;
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: string;
  mobileNumber: string;
  pm: number;
  cn: number;
  dn: number;
  nameCompound: number;
  nameFinal: number;
  mobileCompound: number;
  mobileFinal: number;
  meanings: NumberMeanings;
  createdAt?: string;
}
