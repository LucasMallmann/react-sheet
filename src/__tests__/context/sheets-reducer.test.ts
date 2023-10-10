import { Action, SheetActions } from "@/context/types";
import { describe, expect, it } from "vitest";

import { sheetsReducer } from "@/context/sheets-reducer";

type Payload = { id: string; formula?: string };

function makeEvaluateAction(payload: Payload): Action {
  return {
    type: SheetActions.EVALUATE_CELL,
    payload,
  };
}

describe("sheetsReducer", () => {
  describe("evaluate cell", () => {
    it("should handle EVALUATE_CELL action when inital state is empty", () => {
      const initialState = {
        cells: {},
      };
      const action = makeEvaluateAction({ id: "A1", formula: "lucas foo bar" });

      const newState = sheetsReducer(initialState, action);
      expect(newState.cells["A1"].formula).toBe("lucas foo bar");
      expect(newState.cells["A1"].value).toBe("lucas foo bar");
      expect(newState).toEqual({
        cells: {
          A1: {
            formula: "lucas foo bar",
            value: "lucas foo bar",
          },
        },
      });
    });

    it("should remove cell if from other dependents, if formula does not start with '='", () => {
      // If the cell value does not start with "=", then it is not a child of any other cell
      // Remove it from any "child" or "dependents" list
      const initialState = {
        cells: {
          A1: {
            formula: "=B1",
            value: "foo",
          },
          B1: {
            formula: "foo",
            value: "foo",
            dependents: ["A1", "C4"],
          },
          F6: {
            formula: "foo",
            value: "foo",
            dependents: ["C5", "D3"],
          },
        },
      };
      const action = makeEvaluateAction({ id: "A1", formula: "lucas foo bar" });
      const newState = sheetsReducer(initialState, action);
      expect(newState.cells["A1"].formula).toBe("lucas foo bar");
      expect(newState.cells["A1"].value).toBe("lucas foo bar");
      expect(newState.cells["B1"].dependents).toEqual(["C4"]);
    });

    it("should change all dependents if the parent cell changes", () => {
      /**
       * For example if A1 is the number 42, and B2 references A1,
       * and C3 references B2, then C3 should show 42.
       * If A1 is changed to 36, both B2 and C3 needs to also change to 36.
       */
      const initialState = {
        cells: {
          A1: { formula: "=C5", value: "42", dependents: ["B2"] },
          B2: { formula: "=A1", value: "42", dependents: ["C3", "C4"] },
          C3: { formula: "=B2", value: "42" },
          C4: { formula: "=B2", value: "42" },
          C5: { formula: "42", value: "42", dependents: ["A1", "F99"] },
        },
      };
      const action = makeEvaluateAction({ id: "A1", formula: "36" });
      const newState = sheetsReducer(initialState, action);
      expect(newState.cells["A1"].value).toBe("36");
      expect(newState.cells["B2"].value).toBe("36");
      expect(newState.cells["C3"].value).toBe("36");
      expect(newState.cells["C4"].value).toBe("36");
      expect(newState.cells["A1"].formula).toEqual("36");
      expect(newState.cells["B2"].formula).toBe("=A1");
      expect(newState.cells["B2"].formula).toBe("=A1");
      expect(newState.cells["C4"].formula).toBe("=B2");

      // Check if A1 was removed from C5 dependents
      expect(newState.cells["C5"].dependents).toEqual(["F99"]);
    });
  });
});
