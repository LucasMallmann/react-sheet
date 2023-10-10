import React, { useCallback, useRef, useState } from "react";
import { useClickawayCell } from "@/hooks";
import { useSheetsContext, evaluateCell } from "@/context/sheet";
import styles from "./Cell.module.scss";

type CellProps = {
  cell: {
    value: string;
    formula: string;
    dependents?: string[];
  };
  row: number;
  column: number;
  onSelectCell: (row: number | null, column: number | null) => void;
};

function Cell({ cell, onSelectCell, row, column }: CellProps) {
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
    // onSelectCell(null, null);
  });

  const enableEditMode = useCallback(() => {
    setEditMode(true);
    console.log("alert");
    setTimeout(() => {
      inputRef.current?.focus();
    });
    onSelectCell(row, column);
  }, [column, onSelectCell, row]);

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
        ref={inputRef}
        onKeyDown={enableEvaluateCell}
        className={styles.input}
      />
    );
  }

  return (
    <div
      className={[styles.label, styles.base].join(" ")}
      data-cell-id={id}
      onClick={enableEditMode}
    >
      <span role="button" onClick={enableEditMode}>
        {cell?.value || ""}
      </span>
    </div>
  );
}

export default React.memo(Cell);
