import { useRef, useState } from "react";
import { atom, useRecoilState } from "recoil";
import classes from "./Cell.module.scss";
import { useClickawayCell } from "@/hooks";

const cellState = atom({
  key: "cellState",
  default: "",
});

type CellProps = {
  id?: string;
};

function Cell({ id = "1" }: CellProps) {
  const [cellValue, setCellValue] = useRecoilState(cellState);
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

  if (isEditMode) {
    return (
      <input
        value={cellValue}
        onChange={(e) => setCellValue(e.target.value)}
        type="text"
        data-cell-id={id}
        className={[classes.input, classes.base].join(" ")}
        ref={inputRef}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setEditMode(false);
          }
        }}
      />
    );
  }

  return (
    <div
      className={[classes.label, classes.base].join(" ")}
      data-cell-id={id}
      onClick={enableEditMode}
    >
      {cellValue}
    </div>
  );
}

export default Cell;
