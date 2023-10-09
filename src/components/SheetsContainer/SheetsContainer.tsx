import { useCallback, useState } from "react";
import Cell from "@/components/Cell/Cell";
import CellAxis from "@/components/Cell/CellAxis";
import { numberToChar } from "@/utils/number-to-char";
import { useSheetsContext } from "@/context/sheet";
import classes from "./SheetsContainer.module.scss";

const numberOfColumns = 30;
const numberOfRows = 100;

function SheetsContainer() {
  const { cells } = useSheetsContext();

  const [hightLightCell, setHightLightCell] = useState<{
    row: number | null;
    column: number | null;
  }>({
    row: null,
    column: null,
  });

  const onMouseOver = useCallback((row: number, column: number) => {
    setHightLightCell({ row, column });
  }, []);

  function onMouseLeave() {
    setHightLightCell({ row: null, column: null });
  }

  function renderTableHeaders() {
    return (
      <tr>
        <CellAxis key={0} scope="col"></CellAxis>
        {[...Array(numberOfColumns)].map((_, columnIndex) => (
          <CellAxis
            key={columnIndex + 1}
            scope="col"
            highlight={columnIndex === hightLightCell.column}
          >
            {numberToChar(columnIndex + 1)}
          </CellAxis>
        ))}
      </tr>
    );
  }

  function renderTableRows() {
    return [...Array(numberOfRows)].map((_, rowIndex) => (
      <tr key={rowIndex}>
        <CellAxis highlight={rowIndex === hightLightCell.row}>
          {rowIndex + 1}
        </CellAxis>
        {[...Array(numberOfColumns)].map((_, columnIndex) => (
          <td key={`${rowIndex}-${columnIndex}`}>
            <Cell
              row={rowIndex}
              column={columnIndex}
              cell={cells[`${rowIndex}-${columnIndex}`]}
              onMouseOver={onMouseOver}
            />
          </td>
        ))}
      </tr>
    ));
  }

  return (
    <div className={classes.container}>
      <table onMouseLeave={onMouseLeave}>
        <thead>{renderTableHeaders()}</thead>
        <tbody>{renderTableRows()}</tbody>
      </table>
    </div>
  );
}

export default SheetsContainer;
