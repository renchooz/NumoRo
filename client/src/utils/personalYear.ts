export function generateCycle(pm: number): number[] {
  if (!Number.isFinite(pm)) return [];

  const normalizedPm = Math.trunc(pm);
  if (normalizedPm < 1 || normalizedPm > 9) return [];

  const sequence: number[] = [];

  // Round 1: PM -> 9
  for (let i = normalizedPm; i <= 9; i += 1) sequence.push(i);
  // Round 2: 1 -> 9
  for (let i = 1; i <= 9; i += 1) sequence.push(i);
  // Round 3: 1 -> 9
  for (let i = 1; i <= 9; i += 1) sequence.push(i);

  return sequence;
}

export function getPersonalYearSequence(year: number, pm: number): number[] {
  if (!Number.isFinite(year) || !Number.isFinite(pm)) return [];

  const birthYear = Math.trunc(year);
  const normalizedPm = Math.trunc(pm);
  const sequence = generateCycle(normalizedPm);
  if (sequence.length === 0) return [];

  const results: number[] = [];
  let current = birthYear + normalizedPm;

  results.push(current);

  for (let i = 1; i < sequence.length; i += 1) {
    current += sequence[i];
    results.push(current);
  }

  return results;
}

export function getBirthYearFromDob(dob: string): number | null {
  const m = dob.match(/^\s*\d{1,2}\D+\d{1,2}\D+(\d{2}|\d{4})\s*$/);
  if (!m) return null;

  const rawYear = m[1];
  if (!rawYear) return null;

  if (rawYear.length === 4) {
    const yyyy = Number.parseInt(rawYear, 10);
    return Number.isFinite(yyyy) ? yyyy : null;
  }

  // Fallback for 2-digit years. Keep predictable mapping in modern range.
  const yy = Number.parseInt(rawYear, 10);
  if (!Number.isFinite(yy)) return null;
  return yy >= 50 ? 1900 + yy : 2000 + yy;
}
