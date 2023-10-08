import React, { useRef, useState } from "react";
import { useClickawayCell } from "@/hooks";
import { useSheetsContext, evaluateCell } from "@/context/sheet";
import classes from "./Cell.module.scss";

type CellProps = {
  id: string;
  cell: {
    value: string;
    formula: string;
    dependents?: string[];
  };
};

function Cell({ id, cell }: CellProps) {
  const [value, setValue] = useState("");
  const { dispatchCells } = useSheetsContext();

  const [isEditMode, setEditMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function evaluate() {
    setEditMode(false);
    evaluateCell(dispatchCells, { id, formula: value });
  }

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
      evaluate();
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

export default React.memo(Cell);
