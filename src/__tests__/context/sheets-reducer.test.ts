import { Action, SheetActions } from "@/context/types";
import { describe, expect, it } from "vitest";

import { sheetsReducer } from "@/context/sheets-reducer";

describe("sheetsReducer", () => {
  it("should handle EVALUATE_CELL action when inital state is empty", () => {
    const initialState = {
      cells: {},
    };
    const action: Action = {
      type: SheetActions.EVALUATE_CELL,
      payload: {
        id: "A1",
        formula: "lucas foo bar",
      },
    };
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
});
