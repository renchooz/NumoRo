export type GridType = "loshu" | "pythagoras" | "vedic";

export type GridContentType = "present" | "missing";

export type GridContent = {
  _id: string;
  gridType: GridType;
  type?: GridContentType;
  numbers?: number[];
  // Legacy support for older docs before migration
  number?: number;
  englishContent: string;
  hindiContent: string;
  createdAt: string;
  updatedAt: string;
};

