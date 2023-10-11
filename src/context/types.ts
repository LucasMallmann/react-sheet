export type Cells = {
  [key: string]: {
    value: string;
    formula: string;
    dependents?: string[];
    refError?: boolean;
  };
};

export type SheetState = {
  cells: Cells;
  referenceError?: boolean;
};

export type ContextData = {
  cells: Cells;
  dispatchCells: React.Dispatch<Action>;
  saveToLocalStorage: (sheetId: string) => void;
  referenceError?: boolean;
};

export type Action =
  | { type: "EVALUATE_CELL"; payload: { id: string; formula?: string } }
  | { type: "CLEAR" }
  | { type: "LOAD_FROM_LOCALSTORAGE"; payload: { cells: Cells } }
  | { type: "CLEAR_ERROR" };

export enum SheetActions {
  UPDATE_CELL_FORMULA = "UPDATE_CELL_FORMULA",
  EVALUATE_CELL = "EVALUATE_CELL",
  CLEAR = "CLEAR",
  LOAD_FROM_LOCALSTORAGE = "LOAD_FROM_LOCALSTORAGE",
  CLEAR_ERROR = "CLEAR_ERROR",
}
