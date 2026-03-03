export type Operation = "+" | "-" | "*" | "/";
type ExprNode = { value: number; expr: string };

export type DealAction = {
  firstIndex: number;
  secondIndex: number;
  left: number;
  right: number;
  operation: Operation;
  result: number;
};

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

export function canMake24(nums: number[]): boolean {
  return find24Expression(nums) !== null;
}

function buildExpressionCandidates(a: ExprNode, b: ExprNode): ExprNode[] {
  const candidates: ExprNode[] = [
    { value: a.value + b.value, expr: `(${a.expr}+${b.expr})` },
    { value: a.value - b.value, expr: `(${a.expr}-${b.expr})` },
    { value: b.value - a.value, expr: `(${b.expr}-${a.expr})` },
    { value: a.value * b.value, expr: `(${a.expr}*${b.expr})` },
  ];

  const divideAB = applyOperation(a.value, b.value, "/");
  if (divideAB !== null) {
    candidates.push({ value: divideAB, expr: `(${a.expr}/${b.expr})` });
  }

  const divideBA = applyOperation(b.value, a.value, "/");
  if (divideBA !== null) {
    candidates.push({ value: divideBA, expr: `(${b.expr}/${a.expr})` });
  }

  return candidates;
}

function findExpression(nodes: ExprNode[]): string | null {
  if (nodes.length === 1) {
    return nodes[0]?.value === TARGET ? nodes[0].expr : null;
  }

  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const left = nodes[i]!;
      const right = nodes[j]!;
      const rest = nodes.filter((_, idx) => idx !== i && idx !== j);

      for (const candidate of buildExpressionCandidates(left, right)) {
        const solution = findExpression([...rest, candidate]);
        if (solution) return solution;
      }
    }
  }

  return null;
}

export function find24Expression(nums: number[]): string | null {
  const nodes: ExprNode[] = nums.map((value) => ({
    value,
    expr: String(value),
  }));

  return findExpression(nodes);
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
