export type DigitFrequency = Record<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9, number>;

export type GridKind = "pythagoras" | "loshu" | "vedic";

export type GridCell = {
  n: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  count: number;
};

export type CalculatedGrid = {
  dob: string;
  frequency: DigitFrequency;
  present: number[];
  missing: number[];
  cells: GridCell[];
};

const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export function getDobDigits(dob: string) {
  const digits = (dob.match(/\d/g) ?? [])
    .map((d) => Number(d))
    .filter((d) => Number.isInteger(d) && d >= 1 && d <= 9) as Array<
    1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  >;

  const frequency = DIGITS.reduce((acc, n) => {
    acc[n] = 0;
    return acc;
  }, {} as DigitFrequency);

  for (const d of digits) {
    frequency[d] += 1;
  }

  const present = DIGITS.filter((n) => frequency[n] > 0);
  const missing = DIGITS.filter((n) => frequency[n] === 0);

  return { frequency, present: [...present], missing: [...missing] };
}

const LOSHU_LAYOUT: Array<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9> = [4, 9, 2, 3, 5, 7, 8, 1, 6];
const PYTHAGORAS_LAYOUT: Array<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9> = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function calculateGrid(dob: string, kind: GridKind): CalculatedGrid {
  const { frequency, present, missing } = getDobDigits(dob);

  const layout =
    kind === "loshu"
      ? LOSHU_LAYOUT
      : kind === "pythagoras"
        ? PYTHAGORAS_LAYOUT
        : PYTHAGORAS_LAYOUT;

  const cells = layout.map((n) => ({ n, count: frequency[n] }));

  return {
    dob,
    frequency,
    present,
    missing,
    cells
  };
}

export function formatCellValue(n: number, count: number) {
  if (count <= 0) return "";
  if (count === 1) return String(n);
  return `${String(n).repeat(count)}`;
}

