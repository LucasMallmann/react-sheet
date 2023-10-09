import React, { useCallback, useEffect, useRef, useState } from "react";
import { useClickawayCell } from "@/hooks";
import { useSheetsContext, evaluateCell } from "@/context/sheet";
import classes from "./Cell.module.scss";

type CellProps = {
  cell: {
    value: string;
    formula: string;
    dependents?: string[];
  };
  row: number;
  column: number;
  onMouseOver?: (row: number, column: number) => void;
};

function Cell({ cell, onMouseOver, row, column }: CellProps) {
  const id = `${row}-${column}`;

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

  const enableEditMode = useCallback(() => {
    setEditMode(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  }, []);

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
      onMouseEnter={() => {
        if (onMouseOver) {
          onMouseOver(row, column);
        }
      }}
    >
      {cell?.value || ""}
    </div>
  );
}

export default React.memo(Cell);
