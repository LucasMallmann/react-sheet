import { Action, SheetActions } from "./src/context/types";
import { sheetsReducer } from "./src/context/sheets-reducer";
import { cellIdtoMatrixIndices } from "./src/utils/cell-id-to-matrix";

type Payload = { id: string; formula?: string };

function makeEvaluateAction(payload: Payload): Action {
  return {
    type: SheetActions.EVALUATE_CELL,
    payload,
  };
}

const initialState = {
  cells: {
    A1: {
      formula: "=B1",
      value: "bar 1",
      dependents: ["C1", "C2"],
    },
    B1: {
      formula: "bar 1",
      value: "bar 1",
      dependents: ["A1"],
    },
    B2: {
      formula: "bar bar",
      value: "bar bar",
      dependents: [],
    },
    C1: {
      formula: "=A1",
      value: "bar 1",
      dependents: [],
    },
    C2: {
      formula: "=A1",
      value: "bar 1",
      dependents: [],
    },
  },
};

Object.keys(initialState.cells).forEach((cellId) => {
  console.log(cellIdtoMatrixIndices(cellId));
});
