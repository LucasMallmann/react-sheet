const OPERATORS_REGEX = /^[-+*/]$/;

// Determines the order of operations in an equation
const OPERATIONS_MAPPING_ORDER = [
  {
    "*": (a: number, b: number) => a * b,
    "/": (a: number, b: number) => a / b,
  },
  {
    "+": (a: number, b: number) => a + b,
    "-": (a: number, b: number) => a - b,
  },
];

function tokenize(expression: string): Token[] {
  // Transform expression from "1 + 2" to ["1", "+", "2"]
  const splittedExpression = expression.match(/([-+*/]|\d+\.\d+|\d+)/g);
  if (!splittedExpression) {
    throw new Error("Invalid expression");
  }
  return splittedExpression.map((token) => {
    if (OPERATORS_REGEX.test(token)) {
      return token;
    }
    return parseFloat(token);
  });
}

type Token = string | number;

/**
 * Evaluates a mathematical expression and returns the result.
 * @param expression Expression to be evaluated as an equation
 */
export function parse(expression: string): number {
  let tokens = tokenize(expression);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let operationFn: any = null;
  OPERATIONS_MAPPING_ORDER.forEach((operations) => {
    const result: Token[] = [];
    tokens.forEach((token) => {
      if (token in operations) {
        operationFn = operations[token as keyof typeof operations]!;
      } else if (operationFn && typeof token === "number") {
        result[result.length - 1] = operationFn(
          result[result.length - 1] as number,
          token
        );
        operationFn = null;
      } else {
        result.push(token);
      }
    });
    tokens = result;
  });

  if (tokens.length !== 1) {
    throw new Error("Invalid expression");
  }
  return tokens[0] as number;
}
