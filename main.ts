import { Action, SheetActions } from "./src/context/types";
import { sheetsReducer } from "./src/context/sheets-reducer";

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

console.log(JSON.stringify(newState, null, 2));
