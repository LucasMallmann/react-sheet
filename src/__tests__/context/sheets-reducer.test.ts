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
});
