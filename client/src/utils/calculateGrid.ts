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

function createEmptyFrequency(): DigitFrequency {
  return DIGITS.reduce((acc, n) => {
    acc[n] = 0;
    return acc;
  }, {} as DigitFrequency);
}

function getVedicDobDigits(dob: string): number[] {
  // Target input for Vedic: DD-MM-YY (ignore separators), and ignore 0s later.
  // If user stored DD-MM-YYYY, we convert YYYY -> YY.
  const m = dob.match(/^\s*(\d{1,2})\D+(\d{1,2})\D+(\d{2}|\d{4})\s*$/);
  if (m) {
    const dd = m[1].padStart(2, "0");
    const mm = m[2].padStart(2, "0");
    const year = m[3];
    const yy = year.length === 4 ? year.slice(-2) : year;
    return `${dd}${mm}${yy}`.split("").map((c) => Number(c));
  }

  // Fallback: use digits from the raw string and interpret as DDMMYY if possible:
  // - DD: first 2 digits
  // - MM: next 2 digits
  // - YY: last 2 digits (to mimic YYYY -> YY when present)
  const all = (dob.match(/\d/g) ?? []).map((d) => Number(d)).filter((d) => Number.isInteger(d));
  if (all.length >= 6) {
    return [...all.slice(0, 4), ...all.slice(-2)];
  }
  return all;
}

function getFullDobDigits(dob: string): number[] {
  return (dob.match(/\d/g) ?? [])
    .map((d) => Number(d))
    .filter((d) => Number.isInteger(d) && d >= 0 && d <= 9);
}

// Layouts are listed left-to-right, top-to-bottom for a 3×3 grid.
const LOSHU_LAYOUT: Array<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9> = [4, 9, 2, 3, 5, 7, 8, 1, 6];

// Pythagoras (requested):
// 3 6 9
// 2 5 8
// 1 4 7
const PYTHAGORAS_LAYOUT: Array<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9> = [3, 6, 9, 2, 5, 8, 1, 4, 7];

// Vedic (FINAL requested): 319675284
// 3 1 9
// 6 7 5
// 2 8 4
const VEDIC_LAYOUT: Array<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9> = [3, 1, 9, 6, 7, 5, 2, 8, 4];

function toDigitList(value: number): number[] {
  if (!Number.isFinite(value)) return [];
  return String(Math.trunc(value))
    .split("")
    .map((c) => Number(c))
    .filter((d) => Number.isInteger(d) && d >= 1 && d <= 9);
}

function getDobDigitsByKind(dob: string, kind: GridKind): number[] {
  if (kind === "vedic") {
    return getVedicDobDigits(dob);
  }
  return getFullDobDigits(dob);
}

export function shouldIgnorePmInGrid(dob: string): boolean {
  const day = Number.parseInt(dob.split("-")[0] ?? "", 10);
  if (!Number.isFinite(day)) return false;

  const ignorePM = (day >= 1 && day <= 9) || day === 10 || day === 20 || day === 30;
  return ignorePM;
}

export function getDigitFrequency(dob: string, pm: number, dn: number, kind: GridKind) {
  const dobDigits = getDobDigitsByKind(dob, kind).filter((d) => d >= 1 && d <= 9);
  const ignorePM = shouldIgnorePmInGrid(dob);
  const injected = ignorePM ? [...toDigitList(dn)] : [...toDigitList(pm), ...toDigitList(dn)];
  const digits = [...dobDigits, ...injected] as Array<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>;

  const frequency = createEmptyFrequency();
  for (const d of digits) frequency[d] += 1;

  const present = DIGITS.filter((n) => frequency[n] > 0);
  const missing = DIGITS.filter((n) => frequency[n] === 0);

  return { frequency, present: [...present], missing: [...missing] };
}

export function calculateGrid(dob: string, kind: GridKind, pm: number, dn: number): CalculatedGrid | null {
  if (!dob || pm == null || dn == null) return null;
  if (!Number.isFinite(pm) || !Number.isFinite(dn)) return null;

  const { frequency, present, missing } = getDigitFrequency(dob, pm, dn, kind);

  const layout =
    kind === "loshu"
      ? LOSHU_LAYOUT
      : kind === "pythagoras"
        ? PYTHAGORAS_LAYOUT
        : VEDIC_LAYOUT;

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

