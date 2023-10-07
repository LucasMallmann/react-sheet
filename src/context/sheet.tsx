import { cellIdtoMatrixIndices } from "@/utils";
import { createContext, useContext, useReducer } from "react";

type Cell = {
  [key: string]: {
    value: string;
    formula: string;
    dependents?: string[];
  };
};

type ContextData = {
  cells: Cell;
  dispatchCells: React.Dispatch<Action>;
};

const SheetsContext = createContext<ContextData | undefined>(undefined);

type Props = {
  children: React.ReactNode;
};

type ActionPayload = {
  id: string;
  formula: string;
};

type Action =
  | { type: "UPDATE_CELL_FORMULA"; payload: ActionPayload }
  | { type: "EVALUATE_CELL"; payload: Omit<ActionPayload, "formula"> }
  | { type: "CLEAR" };

export enum SheetActions {
  UPDATE_CELL_FORMULA = "UPDATE_CELL_FORMULA",
  EVALUATE_CELL = "EVALUATE_CELL",
  CLEAR = "CLEAR",
}

const ROW_COLUMN_PATTERN = /([A-Za-z]+)([0-9]+)/;

type UpdateCellPayload = {
  cellId: string;
  newValue: string;
};

function removeIdFromDependents(cells: Cell, id: string): Cell {
  const updatedCells = { ...cells };
  for (const cellId in updatedCells) {
    if (updatedCells[cellId]) {
      const dependents = updatedCells[cellId]?.dependents || [];
      if (dependents.includes(id)) {
        updatedCells[cellId] = {
          ...updatedCells[cellId],
          dependents: dependents.filter((dependentId) => dependentId !== id),
        };
      }
    }
  }
  return updatedCells;
}

function updateCell(
  cells: Cell,
  { cellId, newValue }: UpdateCellPayload
): Cell {
  let updatedCells = { ...cells };
  updatedCells[cellId] = {
    ...updatedCells[cellId],
    value: newValue,
  };
  cells[cellId]?.dependents?.forEach((dependentId) => {
    updatedCells = updateCell(updatedCells, {
      cellId: dependentId,
      newValue,
    });
  });
  return updatedCells;
}

function isCircularReference(
  cellState: Cell,
  cellId: string,
  referencedCellId: string
): boolean {
  const visited = new Set<string>();

  function hasCircularReference(currentId: string, referencedCellId: string) {
    if (visited.has(currentId)) {
      return true;
    }
    visited.add(currentId);
    const currentCell = cellState[currentId];
    const dependents = currentCell?.dependents || [];
    for (const dependentId of dependents) {
      if (dependentId === referencedCellId) {
        return true;
      }
      if (hasCircularReference(dependentId, referencedCellId)) {
        return true;
      }
    }
    visited.delete(currentId);
    return false;
  }

  return hasCircularReference(cellId, referencedCellId);
}

function cellReducer(cellState: Cell, action: Action): Cell {
  switch (action.type) {
    case SheetActions.UPDATE_CELL_FORMULA: {
      const { id: currentCell, formula } = action.payload;
      return {
        ...cellState,
        [currentCell]: {
          ...cellState[currentCell],
          value: formula,
          formula,
        },
      };
    }
    case SheetActions.EVALUATE_CELL: {
      const { id: currentId } = action.payload;
      const currentCell = cellState[currentId];
      const formula = currentCell.formula;

      const isFormulaAReference = currentCell.formula.startsWith("=");
      const isReferenceValid = ROW_COLUMN_PATTERN.test(formula);

      if (isFormulaAReference && isReferenceValid) {
        const { row, column } = cellIdtoMatrixIndices(formula);
        const referencedCellId = `${row}-${column}`;
        const referencedCell = cellState[referencedCellId];
        const isCircularRef = isCircularReference(
          cellState,
          currentId,
          referencedCellId
        );

        if (isCircularRef) {
          throw new Error("Circular reference");
        }

        console.log({ isCircularRef, currentId, referencedCellId });

        return {
          ...cellState,
          [currentId]: {
            ...cellState[currentId],
            value: referencedCell?.value,
            formula,
          },
          [referencedCellId]: {
            ...referencedCell,
            dependents: [...(referencedCell?.dependents || []), currentId],
          },
        };
      }

      return updateCell(removeIdFromDependents(cellState, currentId), {
        cellId: currentId,
        newValue: formula,
      });
    }
    case SheetActions.CLEAR: {
      return {};
    }
  }
  return cellState;
}

export function SheetsProvider({ children }: Props) {
  const [cells, dispatchCells] = useReducer(cellReducer, {} as Cell);

  return (
    <SheetsContext.Provider value={{ cells, dispatchCells }}>
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
