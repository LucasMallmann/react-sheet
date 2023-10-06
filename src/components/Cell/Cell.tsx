import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useClickawayCell } from "@/hooks";
import { cellState, evaluatedCellState } from "@/store/cell";
import graphlib from "@dagrejs/graphlib";

import classes from "./Cell.module.scss";
import { dependencyGraphState } from "@/store/dependency";
import { cellIdtoMatrixIndices } from "@/utils";
// import { cellIdtoMatrixIndices } from "@/utils";

type CellProps = {
  id: string;
};

cell = {
  formula: "=A1",
  value: "10",
};

function Cell({ id }: CellProps) {
  const [cellValue, setCellValue] = useRecoilState(cellState(id));

  const [depGraph, setDepGraph] = useRecoilState(dependencyGraphState);

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

  useEffect(() => {
    if (!cellValue.evaluate || !cellValue.value.startsWith("=")) {
      return;
    }
    // Verify the user input. if starts with '=' then it's a ref.
    // Discover the cell id
    const { row, column } = cellIdtoMatrixIndices(cellValue.value);

    setDepGraph((graph) => {
      graph.setNode(id);

      const relationCellId = `${row}-${column}`;

      graph.setNode(relationCellId);
      graph.setEdge(id, relationCellId, {
        from: id,
        to: relationCellId,
      });

      // graph.no

      if (!graphlib.alg.isAcyclic(graph)) {
        // if there is a cycle
        console.error("Graph is cyclical. Handle it.");
      }

      console.log("nodes ", graph.nodes());
      console.log("edges ", graph.edges());

      return graph;
    });
  }, [cellValue.evaluate, cellValue.value, id, setDepGraph]);

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
