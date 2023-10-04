import { atomFamily, selectorFamily } from "recoil";

export const cellState = atomFamily({
  key: "cellState",
  default: "",
});

export const evaluatedCellState = selectorFamily({
  key: "evaluateCellState",
  get:
    (id) =>
    ({ get }) => {
      const value = get(cellState(id));

      if (!value.startsWith("=")) {
        return value;
      }

      return `[${String(id)}]=${value}`;
    },
});
