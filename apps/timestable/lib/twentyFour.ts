export type Operation = "+" | "-" | "*" | "/";

export const TARGET = 24;

export function applyOperation(a: number, b: number, op: Operation) {
  if (op === "+") {
    return a + b;
  }
  if (op === "-") {
    return a - b;
  }
  if (op === "*") {
    return a * b;
  }
  if (b === 0 || !Number.isInteger(a) || !Number.isInteger(b)) {
    return null;
  }
  if (a % b !== 0) {
    return null;
  }
  return a / b;
}

function getDivisionIfValid(value1: number, value2: number): number[] {
  const values: number[] = [];
  const result1 = applyOperation(value1, value2, "/");
  if (result1 !== null) {
    values.push(result1);
  }
  const result2 = applyOperation(value2, value1, "/");
  if (result2 !== null) {
    const alreadyIncluded = values.some((value) => value === result2);
    if (!alreadyIncluded) {
      values.push(result2);
    }
  }
  return values;
}

export function canMake24(nums: number[]): boolean {
  if (nums.length === 1) {
    return nums[0] === TARGET;
  }

  for (let i = 0; i < nums.length; i += 1) {
    for (let j = i + 1; j < nums.length; j += 1) {
      const a = nums[i];
      const b = nums[j];
      const rest = nums.filter((_, idx) => idx !== i && idx !== j);

      const candidates: number[] = [
        a + b,
        a - b,
        b - a,
        a * b,
        ...getDivisionIfValid(a, b),
      ];

      for (const next of candidates) {
        if (canMake24([...rest, next])) return true;
      }
    }
  }

  return false;
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateSolvableCards(maxAttempts = 400): number[] {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const cards = Array.from({ length: 4 }, () => randomInt(1, 13));
    if (canMake24(cards)) return cards;
  }

  return [1, 2, 3, 4];
}

export function generateSolvableDeals(count: number): number[][] {
  return Array.from({ length: count }, () => generateSolvableCards());
}

export function formatCardValue(value: number) {
  return String(Math.round(value));
}

export function isTwentyFour(value: number) {
  return value === TARGET;
}
