import {
  isCircularReference,
  removeIdFromDependents,
  updateCell,
} from "@/utils/cell";
import { Action, SheetActions, SheetState } from "./types";
import { cellIdtoMatrixIndices } from "@/utils/cell-id-to-matrix";

const ROW_COLUMN_PATTERN = /^([A-Za-z]+)([0-9]+)$/;

function isInputAReference(value: string) {
  const isFormulaAReference = value.startsWith("=");
  const isReferenceValid = ROW_COLUMN_PATTERN.test(value.slice(1));
  return isFormulaAReference && isReferenceValid;
}

export function sheetsReducer(
  sheetState: SheetState,
  action: Action
): SheetState {
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

        if (circularReference) {
          const updated = {
            ...sheetState,
            referenceError: true,
          };
          return updated;
        }

        const referencedCell = cells[referencedCellId];
        const updatedReferencedCell = {
          ...referencedCell,
          dependents: [...(referencedCell?.dependents || []), currentId],
        };
        const cleanedCells = removeIdFromDependents(cells, currentId);
        const updatedCells = updateCell(
          {
            ...cleanedCells,
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
          { cellId: currentId, newValue: userInput },
          true
        );

        return { ...sheetState, cells: updatedCells };
      }

      const newState = Object.assign({}, sheetState, {
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

      return newState;
    }
    case SheetActions.CLEAR: {
      return {
        cells: {},
        circularReference: false,
      } as SheetState;
    }
    case SheetActions.LOAD_FROM_LOCALSTORAGE: {
      return {
        referenceError: false,
        cells: action.payload.cells,
      };
    }
    case SheetActions.CLEAR_ERROR: {
      return {
        ...sheetState,
        referenceError: false,
      };
    }
  }
  return sheetState;
}

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

export function clearErrorFromSheet(dispatchCells: React.Dispatch<Action>) {
  dispatchCells({
    type: SheetActions.CLEAR_ERROR,
  });
}
