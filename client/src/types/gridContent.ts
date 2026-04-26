export type GridType = "loshu" | "pythagoras" | "vedic";

export type GridContent = {
  _id: string;
  gridType: GridType;
  number: number;
  englishContent: string;
  hindiContent: string;
  createdAt: string;
  updatedAt: string;
};

