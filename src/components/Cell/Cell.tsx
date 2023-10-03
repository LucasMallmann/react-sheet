import { useRef, useState } from "react";
import { atomFamily, useRecoilState } from "recoil";
import { useClickawayCell } from "@/hooks";
import classes from "./Cell.module.scss";

const cellState = atomFamily({
  key: "cellState",
  default: "",
});

type CellProps = {
  id: string;
};

function Cell({ id }: CellProps) {
  const [cellValue, setCellValue] = useRecoilState(cellState(id));
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
