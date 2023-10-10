import { expect, it, describe } from "vitest";

import {
  // isCircularReference,
  removeIdFromDependents,
  updateCell,
} from "@/utils/cell";

describe("cell", () => {
  describe("removeIdFromDependents", () => {
    it("should remove the specified ID from dependents", () => {
      const cells = {
        cell1: { value: "1", formula: "", dependents: ["cell2", "cell3"] },
        cell2: { value: "2", formula: "", dependents: ["cell1"] },
        cell3: {
          value: "3",
          formula: "",
          dependents: ["cell1", "cell2", "cell3"],
        },
        cell4: {
          value: "3",
          formula: "",
          dependents: ["cell1", "cell2", "cell10"],
        },
      };
      const updatedCells = removeIdFromDependents(cells, "cell1");
      expect(updatedCells.cell1.dependents).toEqual(["cell2", "cell3"]);
      expect(updatedCells.cell2.dependents).toEqual([]);
      expect(updatedCells.cell3.dependents).toEqual(["cell2", "cell3"]);
      expect(updatedCells.cell4.dependents).toEqual(["cell2", "cell10"]);
    });

    it("should handle cells without dependents", () => {
      const cells = {
        cell1: { value: "1", formula: "" },
        cell2: { value: "2", formula: "" },
      };
      const updatedCells = removeIdFromDependents(cells, "cell1");
      expect(updatedCells.cell1.dependents).toBeUndefined();
      expect(updatedCells.cell2.dependents).toBeUndefined();
    });

    it("should return the original cells object if the ID is not found", () => {
      const cells = {
        cell1: { value: "1", formula: "", dependents: ["cell2"] },
        cell2: { value: "2", formula: "", dependents: ["cell1"] },
      };
      const updatedCells = removeIdFromDependents(cells, "cell3");
      expect(updatedCells).toEqual(cells);
    });
  });

  describe("updateCell", () => {
    it("should update the value of the specified cell", () => {
      const cells = {
        cell1: { value: "1", formula: "", dependents: ["cell2"] },
        cell2: { value: "2", formula: "", dependents: ["cell4"] },
        cell3: { value: "3", formula: "", dependents: ["cell4"] },
        cell4: { value: "4", formula: "", dependents: [] },
      };
      const updatedCells = updateCell(cells, {
        cellId: "cell1",
        newValue: "5",
      });
      expect(updatedCells.cell1.value).toBe("5");
      expect(updatedCells.cell2.value).toBe("5");
      expect(updatedCells.cell4.value).toBe("5");
    });

    it("should update multiple cells and their dependents", () => {
      const cells = {
        cell1: { value: "1", formula: "", dependents: ["cell2"] },
        cell2: { value: "2", formula: "", dependents: ["cell3"] },
        cell3: { value: "3", formula: "", dependents: [] },
      };
      const updatedCells = updateCell(cells, {
        cellId: "cell1",
        newValue: "5",
      });
      expect(updatedCells.cell1.value).toBe("5");
      expect(updatedCells.cell2.value).toBe("5");
      expect(updatedCells.cell3.value).toBe("5");
    });

    it("should handle cells without dependents", () => {
      const cells = {
        cell1: { value: "1", formula: "" },
        cell2: { value: "2", formula: "" },
      };
      const updatedCells = updateCell(cells, {
        cellId: "cell1",
        newValue: "5",
      });
      expect(updatedCells.cell1.value).toBe("5");
      expect(updatedCells.cell2.value).toBe("2");
    });

    it("should not update other cells if cellId is not found", () => {
      const cells = {
        cell1: { value: "1", formula: "", dependents: ["cell2"] },
        cell2: { value: "2", formula: "", dependents: [] },
      };
      const updatedCells = updateCell(cells, {
        cellId: "cell3",
        newValue: "5",
      });
      expect(updatedCells).toEqual(cells);
    });
  });
});
