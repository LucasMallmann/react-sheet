/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from "react";
import { useClickawayCell } from "@/hooks";
import classes from "./Cell.module.scss";
import { SheetActions, useSheetsContext } from "@/context/sheet";

type CellProps = {
  id: string;
};

function Cell({ id }: CellProps) {
  const [value, setValue] = useState("");
  const { cells, dispatchCells } = useSheetsContext();

  // const debouncedValue = useDebounce(value);

  const cell = cells[id];

  const [isEditMode, setEditMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useClickawayCell(id, () => {
    setEditMode(false);
  });

  function enableEditMode() {
    setEditMode(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  }

  function enableEvaluateCell(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      setEditMode(false);
      dispatchCells({
        type: SheetActions.EVALUATE_CELL,
        payload: { id, formula: value },
      });
    }
  }

  if (isEditMode) {
    return (
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type="text"
        data-cell-id={id}
        className={[classes.input, classes.base].join(" ")}
        ref={inputRef}
        onKeyDown={enableEvaluateCell}
      />
    );
  }

  return (
    <div
      className={[classes.label, classes.base].join(" ")}
      data-cell-id={id}
      onClick={enableEditMode}
    >
      {cell?.value || ""}
    </div>
  );
}

export default Cell;
