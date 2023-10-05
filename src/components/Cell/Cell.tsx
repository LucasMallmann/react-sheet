import { useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useClickawayCell } from "@/hooks";
import { cellState, evaluatedCellState } from "@/store/cell";

import classes from "./Cell.module.scss";

type CellProps = {
  id: string;
};

function Cell({ id }: CellProps) {
  const [cellValue, setCellValue] = useRecoilState(cellState(id));
  const [isEditMode, setEditMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const evaluatedCellValue = useRecoilValue(evaluatedCellState(id));

  useClickawayCell(id, () => {
    setEditMode(false);
  });

  function enableEditMode() {
    setCellValue((state) => ({
      ...state,
      evaluate: false,
    }));
    setEditMode(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  }

  function updateCellValue(e: React.ChangeEvent<HTMLInputElement>) {
    setCellValue((state) => ({
      ...state,
      value: e.target.value,
    }));
  }

  function enableEvaluateCell(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      setEditMode(false);
      setCellValue((state) => ({
        ...state,
        evaluate: true,
      }));
    }
  }

  if (isEditMode) {
    return (
      <input
        value={cellValue.value}
        onChange={updateCellValue}
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
      {evaluatedCellValue}
    </div>
  );
}

export default Cell;
