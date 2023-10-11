import { createContext, useContext, useReducer } from "react";

import { useLoadFromLocalStorage } from "@/hooks/use-load-local-storage";
import { Action, Cells, ContextData, SheetActions, SheetState } from "./types";
import { sheetsReducer } from "./sheets-reducer";

const SheetsContext = createContext<ContextData>({} as ContextData);

type Props = {
  children: React.ReactNode;
};

export function SheetsProvider({ children }: Props) {
  const [sheetState, dispatchSheetState] = useReducer(sheetsReducer, {
    cells: {},
  } as SheetState);

  useLoadFromLocalStorage((localStorageData) => {
    dispatchSheetState({
      type: SheetActions.LOAD_FROM_LOCALSTORAGE,
      payload: { cells: localStorageData as Cells },
    });
  });

  function saveToLocalStorage(sheetId: string) {
    localStorage.setItem(sheetId, JSON.stringify(sheetState.cells));
  }

  return (
    <SheetsContext.Provider
      value={{
        cells: sheetState.cells,
        dispatchCells: dispatchSheetState,
        saveToLocalStorage,
      }}
    >
      {children}
    </SheetsContext.Provider>
  );
}

SheetsProvider.displayName = "SheetsProvider";

type EvaluateCellParams = {
  id: string;
  formula: string;
};

export function evaluateCell(
  dispatchCells: React.Dispatch<Action>,
  { id, formula }: EvaluateCellParams
) {
  dispatchCells({
    type: SheetActions.EVALUATE_CELL,
    payload: { id, formula },
  });
}

export function useSheetsContext() {
  const context = useContext(SheetsContext);
  if (context === undefined) {
    throw new Error("useSheetsContext must be used within a SheetsProvider");
  }
  return context;
}
