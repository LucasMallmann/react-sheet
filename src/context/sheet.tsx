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
  | { type: "EVALUATE_CELL"; payload: Omit<ActionPayload, "formula"> };

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
  { cellId, newValue }: UpdateCellPayload,
  visited = new Set<string>()
): Cell {
  if (visited.has(cellId)) {
    throw new Error("Circular dependency detected");
  }

  visited.add(cellId);

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

      // TODO: update dependents of the referenced cell
      if (isFormulaAReference && isReferenceValid) {
        const { row, column } = cellIdtoMatrixIndices(formula);
        const referencedCellId = `${row}-${column}`;
        const referencedCell = cellState[referencedCellId];
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

      const cleanedUpDependents = removeIdFromDependents(cellState, currentId);

      // TODO Recalculate and change all dependents cells
      return updateCell(cleanedUpDependents, {
        cellId: currentId,
        newValue: formula,
      });
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
