import { cellIdtoMatrixIndices } from "@/utils/cell-id-to-matrix";
import { describe, expect, it } from "vitest";

describe("cellIdtoMatrixIndices", () => {
  it('should convert cell ID "A1" to column 0 and row 0', () => {
    const result = cellIdtoMatrixIndices("A1");
    expect(result.column).toBe(0);
    expect(result.row).toBe(0);
  });

  it('should convert cell ID "B2" to column 1 and row 1', () => {
    const result = cellIdtoMatrixIndices("B2");
    expect(result.column).toBe(1);
    expect(result.row).toBe(1);
  });

  it('should convert cell ID "Z26" to column 25 and row 25', () => {
    const result = cellIdtoMatrixIndices("Z26");
    expect(result.column).toBe(25);
    expect(result.row).toBe(25);
  });

  it('should convert cell ID "AA27" to column 26 and row 26', () => {
    const result = cellIdtoMatrixIndices("AA27");
    expect(result.column).toBe(26);
    expect(result.row).toBe(26);
  });

  it('should convert cell ID "AZ52" to column 51 and row 51', () => {
    const result = cellIdtoMatrixIndices("AZ52");
    expect(result.column).toBe(51);
    expect(result.row).toBe(51);
  });

  // Add more test cases as needed
});
