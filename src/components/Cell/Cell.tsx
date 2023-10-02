import { useState } from "react";
import classes from "./Cell.module.scss";

const Cell = () => {
  const [isEditMode] = useState(false);

  if (isEditMode) {
    return <input type="text" data-cell-id="1" className={classes.CellInput} />;
  }

  return (
    <div className={classes.CellLabel} data-cell-id="1">
      Value
    </div>
  );
};

export default Cell;
