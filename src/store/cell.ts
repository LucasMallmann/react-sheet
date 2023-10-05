import { atomFamily, selectorFamily } from "recoil";

import { evaluateEquation } from "@/utils";

export const cellState = atomFamily({
  key: "cellState",
  default: {
    value: "",
    evaluate: false,
  },
});

export const evaluatedCellState = selectorFamily({
  key: "evaluateCellState",
  get:
    (id) =>
    ({ get }) => {
      const cell = get(cellState(id));

      if (!cell.evaluate) {
        return cell.value;
      }
      if (cell.value.startsWith("=")) {
        return evaluateEquation(cell.value.slice(1));
      }

      return cell.value;
    },
});
