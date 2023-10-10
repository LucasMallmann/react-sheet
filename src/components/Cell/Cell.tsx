import React, { useCallback, useEffect, useRef, useState } from "react";
import { useClickawayCell } from "@/hooks";
import { useSheetsContext, evaluateCell } from "@/context/Sheet";
import styles from "./Cell.module.scss";

type CellProps = {
  row: number;
  column: number;
  onSelectCell: (row: number | null, column: number | null) => void;
  onOpenModal?: () => void;
};

function Cell({ onSelectCell, onOpenModal, row, column }: CellProps) {
  const { dispatchCells, cells } = useSheetsContext();

  const id = `${row}-${column}`;
  const cell = cells[id];

  if (id === "0-1") {
    console.log(cell?.refError);
  }

  const [value, setValue] = useState("");

  const [isEditMode, setEditMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (cell?.formula) {
      setValue(cell?.formula);
    }
  }, [cell?.formula]);

  useEffect(() => {
    if (cell?.refError && onOpenModal) {
      onOpenModal();
    }
  }, [cell?.refError, onOpenModal]);

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

  const classNames = [styles.label, styles.base].join(" ");

  return (
    <div
      data-title="Celula"
      className={classNames}
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
