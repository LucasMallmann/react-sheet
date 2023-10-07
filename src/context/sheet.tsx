import { createContext, useContext, useEffect, useReducer } from "react";
import { useLoaderData } from "react-router-dom";
import { cellIdtoMatrixIndices } from "@/utils/cell-id-to-matrix";
import {
  isCircularReference,
  removeIdFromDependents,
  updateCell,
} from "@/utils/cell";

type Cells = {
  [key: string]: {
    value: string;
    formula: string;
    dependents?: string[];
  };
};

type SheetState = {
  cells: Cells;
  circularReference?: unknown;
};

type ContextData = {
  cells: Cells;
  dispatchCells: React.Dispatch<Action>;
  saveToLocalStorage: () => void;
};

const SheetsContext = createContext<ContextData | undefined>(undefined);

type Action =
  | { type: "EVALUATE_CELL"; payload: { id: string; formula?: string } }
  | { type: "CLEAR" }
  | { type: "LOAD_FROM_LOCALSTORAGE"; payload: { cells: Cells } };

export enum SheetActions {
  UPDATE_CELL_FORMULA = "UPDATE_CELL_FORMULA",
  EVALUATE_CELL = "EVALUATE_CELL",
  CLEAR = "CLEAR",
  LOAD_FROM_LOCALSTORAGE = "LOAD_FROM_LOCALSTORAGE",
}

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

        const isCircularRef = isCircularReference(
          cells,
          currentId,
          referencedCellId
        );

        if (isCircularRef) {
          throw new Error("Circular reference");
        }

        const referencedCell = cells[referencedCellId];
        const updatedCellsWithDependents = Object.assign({}, cells, {
          [referencedCellId]: {
            ...referencedCell,
            dependents: [...(referencedCell?.dependents || []), currentId],
          },
        });

        return Object.assign({}, sheetState, {
          cells: updateCell(updatedCellsWithDependents, {
            cellId: currentId,
            newValue: referencedCell?.value || "",
          }),
        });
      }

      const dependents = currentCell?.dependents || [];

      if (dependents.length > 0) {
        return {
          ...sheetState,
          cells: updateCell(removeIdFromDependents(cells, currentId), {
            cellId: currentId,
            newValue: userInput,
          }),
        };
      }

      return {
        ...sheetState,
        cells: {
          ...sheetState.cells,
          [currentId]: {
            ...cells[currentId],
            value: userInput,
            formula: userInput,
          },
        },
      };
    }
    case SheetActions.CLEAR: {
      return {} as SheetState;
    }
    case SheetActions.LOAD_FROM_LOCALSTORAGE: {
      return {
        circularReference: undefined,
        cells: action.payload.cells,
      };
    }
  }
  return sheetState;
}

type Props = {
  children: React.ReactNode;
  sheetId: string;
};

export function SheetsProvider({ children, sheetId }: Props) {
  const [sheetState, dispatchSheetState] = useReducer(sheetsReducer, {
    cells: {},
  } as SheetState);

  const sheetFromLocalStorage = useLoaderData();

  useEffect(() => {
    if (
      !sheetFromLocalStorage ||
      Object.keys(sheetFromLocalStorage).length === 0
    ) {
      return;
    }

    dispatchSheetState({
      type: SheetActions.LOAD_FROM_LOCALSTORAGE,
      payload: { cells: sheetFromLocalStorage as Cells },
    });
  }, [sheetFromLocalStorage]);

  function saveToLocalStorage() {
    localStorage.setItem(sheetId, JSON.stringify(sheetState));
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

export function useSheetsContext() {
  const context = useContext(SheetsContext);
  if (context === undefined) {
    throw new Error("useSheetsContext must be used within a SheetsProvider");
  }
  return context;
}
