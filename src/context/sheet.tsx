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

function cellReducer(sheetState: SheetState, action: Action): SheetState {
  const cells = sheetState.cells;
  switch (action.type) {
    case SheetActions.EVALUATE_CELL: {
      const { id: currentId, formula: userInput = "" } = action.payload;
      const currentCell = cells[currentId];
      const isFormulaAReference = userInput.startsWith("=");
      const isReferenceValid = ROW_COLUMN_PATTERN.test(userInput.slice(1));

      if (isFormulaAReference && isReferenceValid) {
        // Add the current cell as dependent of the referenced cell
        const { row, column } = cellIdtoMatrixIndices(userInput);
        const referencedCellId = `${row}-${column}`;
        const referencedCell = cells[referencedCellId];
        const isCircularRef = isCircularReference(
          cells,
          currentId,
          referencedCellId
        );

        if (isCircularRef) {
          throw new Error("Circular reference");
        }

        const newValue = referencedCell?.value || "";
        // Update this cell and all its dependents...okay
        const updatedCells = updateCell(
          {
            ...cells,
            // referencedCell.dependents.push(currentCell)
            [referencedCellId]: {
              ...referencedCell,
              dependents: [...(referencedCell?.dependents || []), currentId],
            },
          },
          {
            cellId: currentId,
            newValue,
          }
        );

        return {
          ...sheetState,
          cells: updatedCells,
        };
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
            value: userInput || "",
            formula: userInput || "",
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
  const [sheetState, dispatchSheetState] = useReducer(cellReducer, {
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
