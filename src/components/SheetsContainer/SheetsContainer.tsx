import { useCallback, useState } from "react";
import Cell from "@/components/Cell/Cell";
import CellAxis from "@/components/Cell/CellAxis";
import Header from "@/components/Header/Header";
import Popup from "@/components/Popup/Popup";

import { useModal } from "@/hooks/use-modal";
import { numberToChar } from "@/utils/number-to-char";

import styles from "./SheetsContainer.module.scss";
import { useSheetsContext } from "@/context/Sheet";
import { clearErrorFromSheet } from "@/context/sheets-reducer";

const numberOfColumns = 30;
const numberOfRows = 100;

type HighlightState = {
  row: number | null;
  column: number | null;
};

function SheetsContainer() {
  const { dispatchCells } = useSheetsContext();
  const { modalRef, isModalOpen, onOpenModal } = useModal(() => {
    clearErrorFromSheet(dispatchCells);
  });

  const [hightLightCell, setHightLightCell] = useState<HighlightState>({
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
              onSelectCell={selectCell}
              onOpenModal={onOpenModal}
            />
          </td>
        ))}
      </tr>
    ));
  }

  return (
    <div>
      <Header
        selectedCellId={`${hightLightCell.row}-${hightLightCell.column}`}
      />
      <Popup ref={modalRef} open={isModalOpen} />
      <main className={styles.container}>
        <table className={styles.table}>
          <thead>{renderTableHeaders()}</thead>
          <tbody>{renderTableRows()}</tbody>
        </table>
      </main>
    </div>
  );
}

export default SheetsContainer;
