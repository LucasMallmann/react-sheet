import { describe } from "node:test";
import { expect, it } from "vitest";

import { removeIdFromDependents } from "@/utils/cell";

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
  });
});
