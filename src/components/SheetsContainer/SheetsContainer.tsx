import { useCallback, useState } from "react";
import Cell from "@/components/Cell/Cell";
import CellAxis from "@/components/Cell/CellAxis";
import Share from "@/components/Share/Share";
import { numberToChar } from "@/utils/number-to-char";
import { useSheetsContext } from "@/context/sheet";
import styles from "./SheetsContainer.module.scss";

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

  const selectCell = useCallback(
    (row: number | null, column: number | null) => {
      setHightLightCell({ row, column });
    },
    []
  );

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
              onSelectCell={selectCell}
            />
          </td>
        ))}
      </tr>
    ));
  }

  return (
    <section className={styles.container}>
      <Share>Share</Share>

      <table className={styles.table}>
        <thead>{renderTableHeaders()}</thead>
        <tbody>{renderTableRows()}</tbody>
      </table>
    </section>
  );
}

export default SheetsContainer;
