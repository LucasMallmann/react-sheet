import { Action, SheetActions, SheetState } from "@/context/types";
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

    it("should include current cell as dependent of the target cell", () => {
      // If I say A1 = B1, then B1 should have A1 as a dependent
      const initialState = {
        cells: {
          "0-1": {
            formula: "foo",
            value: "foo",
          },
        },
      } as unknown as SheetState;
      const action = makeEvaluateAction({
        id: "0-0",
        formula: "=B1",
      });
      const newState = sheetsReducer(initialState, action);
      expect(newState).toEqual({
        cells: {
          "0-0": {
            formula: "=B1",
            value: "foo",
            dependents: [],
          },
          "0-1": {
            formula: "foo",
            value: "foo",
            dependents: ["0-0"],
          },
        },
      });
    });

    it("should update all dependents when cell starts referencing another cell", () => {
      // If I say A1 = B1, then B1 should have A1 as a dependent
      const initialState = {
        cells: {
          // A1
          "0-0": {
            formula: "=B1",
            value: "bar 1",
            dependents: ["0-2", "1-2"],
          },
          // B1
          "0-1": {
            formula: "bar 1",
            value: "bar 1",
            dependents: ["0-0"],
          },
          // B2
          "1-1": {
            formula: "bar bar",
            value: "bar bar",
            dependents: [],
          },
          // C1
          "0-2": {
            formula: "=A1",
            value: "bar 1",
            dependents: [],
          },
          // C2
          "1-2": {
            formula: "=A1",
            value: "bar 1",
            dependents: [],
          },
        },
      } as unknown as SheetState;

      const action = makeEvaluateAction({
        id: "0-0",
        formula: "=B2",
      });
      const newState = sheetsReducer(initialState, action);
      expect(newState.cells["0-0"].formula).toBe("=B2");
      expect(newState.cells["0-0"].value).toBe("bar bar");
      expect(newState.cells["0-0"].dependents).toEqual(["0-2", "1-2"]);
      // Check if a1 has been removed from b1
      expect(newState.cells["0-1"].dependents).toEqual([]);

      // Check if b2 has a1
      expect(newState.cells["1-1"].dependents).toEqual(["0-0"]);

      // Check if c1 and c2 have been updated
      expect(newState.cells["0-2"].value).toBe("bar bar");
      expect(newState.cells["1-2"].value).toBe("bar bar");
    });

    it("shold not return circular reference error if the cell is not circular", () => {
      const initialState = {
        cells: {
          "0-0": {
            formula: "=b1",
            value: "",
            dependents: [],
          },
          "0-1": {
            formula: "=c1",
            value: "",
            dependents: ["0-0"],
          },
          "0-2": {
            dependents: ["0-1"],
          },
        },
      } as unknown as SheetState;
      const action = makeEvaluateAction({ id: "0-2", formula: "=D1" });
      const newState = sheetsReducer(initialState, action);
      console.log(JSON.stringify(newState, null, 2));
      expect(newState.cells["0-2"].refError).toBe(false);
    });
  });
});
