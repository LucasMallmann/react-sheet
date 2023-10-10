import { expect, it, describe } from "vitest";

import { numberToChar } from "@/utils/number-to-char";

describe("numberToChar", () => {
  it('should return "A" for 1', () => {
    const result = numberToChar(1);
    expect(result).toBe("A");
  });

  it('should return "Z" for 26', () => {
    const result = numberToChar(26);
    expect(result).toBe("Z");
  });

  it('should return "AA" for 27', () => {
    const result = numberToChar(27);
    expect(result).toBe("AA");
  });

  it('should return "AB" for 28', () => {
    const result = numberToChar(30);
    expect(result).toBe("AD");
  });
});
