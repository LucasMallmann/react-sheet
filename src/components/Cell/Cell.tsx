import { useRef, useState } from "react";
import classes from "./Cell.module.scss";

const Cell = () => {
  const [isEditMode, setEditMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const enableEditMode = () => {
    setEditMode(true);
    inputRef.current?.focus();
  };

  if (isEditMode) {
    return (
      <input
        type="text"
        data-cell-id="1"
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
      data-cell-id="1"
      onClick={enableEditMode}
    >
      Value
    </div>
  );
};

export default Cell;
