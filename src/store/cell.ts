import { atomFamily, selectorFamily } from "recoil";

export const cellState = atomFamily({
  key: "cellState",
  default: (id) => {
    return {
      id,
      value: "",
      evaluate: false,
    };
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
        return cell.value;
      } catch (error) {
        console.log(error);
        return "!ERROR";
      }
    },
});
