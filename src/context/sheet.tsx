import { createContext, useContext, useReducer } from "react";
import { cellIdtoMatrixIndices } from "@/utils/cell-id-to-matrix";
import {
  isCircularReference,
  removeIdFromDependents,
  updateCell,
} from "@/utils/cell";
import { useLoadFromLocalStorage } from "@/hooks/use-load-local-storage";
import { Action, Cells, ContextData, SheetActions, SheetState } from "./types";

const SheetsContext = createContext<ContextData>({} as ContextData);

const ROW_COLUMN_PATTERN = /^([A-Za-z]+)([0-9]+)$/;

function isInputAReference(value: string) {
  const isFormulaAReference = value.startsWith("=");
  const isReferenceValid = ROW_COLUMN_PATTERN.test(value.slice(1));
  return isFormulaAReference && isReferenceValid;
}

function sheetsReducer(sheetState: SheetState, action: Action): SheetState {
  const cells = sheetState.cells;
  switch (action.type) {
    case SheetActions.EVALUATE_CELL: {
      const { id: currentId, formula: userInput = "" } = action.payload;
      const currentCell = cells[currentId];

      if (isInputAReference(userInput)) {
        const { row, column } = cellIdtoMatrixIndices(userInput);
        const referencedCellId = `${row}-${column}`;

        if (referencedCellId === currentId) {
          return sheetState;
        }

        const circularReference = isCircularReference(
          cells,
          currentId,
          referencedCellId
        );

        console.log({ circularReference });

        if (circularReference) {
          return {
            ...sheetState,
            cells: {
              ...cells,
              [currentId]: {
                ...currentCell,
                refError: true,
              },
            },
          };
        }

        const referencedCell = cells[referencedCellId];

        const updatedReferencedCell = {
          ...referencedCell,
          dependents: [...(referencedCell?.dependents || []), currentId],
        };

        const updatedCells = updateCell(
          {
            ...cells,
            [currentId]: {
              formula: userInput,
              value: userInput,
              dependents: [...(currentCell?.dependents || [])],
            },
            [referencedCellId]: updatedReferencedCell,
          },
          { cellId: currentId, newValue: referencedCell?.value || "" }
        );

        return { ...sheetState, cells: updatedCells };
      }

      const dependents = currentCell?.dependents || [];

      if (dependents.length > 0) {
        const updatedCells = updateCell(
          removeIdFromDependents(cells, currentId),
          { cellId: currentId, newValue: userInput }
        );

        return { ...sheetState, cells: updatedCells };
      }

      return Object.assign({}, sheetState, {
        cells: removeIdFromDependents(
          {
            ...sheetState.cells,
            [currentId]: {
              value: userInput,
              formula: userInput,
            },
          },
          currentId
        ),
      });
    }
    case SheetActions.CLEAR: {
      return {
        cells: {},
        circularReference: null,
      } as SheetState;
    }
    case SheetActions.LOAD_FROM_LOCALSTORAGE: {
      return {
        referenceError: null,
        cells: action.payload.cells,
      };
    }
  }
  return sheetState;
}

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
