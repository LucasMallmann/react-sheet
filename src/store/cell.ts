import { atomFamily, selectorFamily } from "recoil";

import { cellIdtoMatrixIndices, evaluateEquation } from "@/utils";

export const cellState = atomFamily({
  key: "cellState",
  default: {
    value: "",
    evaluate: false,
  },
});

// CELL - ID=row, column

export const evaluatedCellState = selectorFamily({
  key: "evaluateCellState",
  get:
    (id) =>
    ({ get }) => {
      try {
        const cell = get(cellState(id));

        if (cell.value.startsWith("=")) {
          const value = cell.value.slice(1); //A1
          const cellName = value.match(/[A-Z]+[0-9]+/gi) || [];
          const { row, column } = cellIdtoMatrixIndices(cellName[0] as string);
          const referenceId = `${row}-${column}`;
          const referenceCell = get(cellState(referenceId));
          if (referenceCell.value.startsWith("=")) {
            console.log("RODANDO DE NOVO");
            const value = cell.value.slice(1); //A1
            const cellName = value.match(/[A-Z]+[0-9]+/gi) || [];
            const { row, column } = cellIdtoMatrixIndices(
              cellName[0] as string
            );
            const referenceId = `${row}-${column}`;
            console.log("REF CELL ID ", referenceId, value);
            const referenceCell = get(cellState(referenceId));
            return referenceCell.value;
          } else {
            return referenceCell.value;
          }
        }

        // if (!cell.evaluate) {
        //   return cell.value;
        // }

        // if (cell.value.startsWith("=")) {

        //   console.log(
        //     `cell ${id} is referencing ${newId} with value = ${referenceCell.value}`
        //   );
        //   return referenceCell.value;
        // }

        return cell.value;
      } catch (error) {
        console.log(error);
        return "!ERROR";
      }
    },
});
