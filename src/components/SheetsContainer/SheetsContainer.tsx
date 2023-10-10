import { useCallback, useEffect, useRef, useState } from "react";
import Cell from "@/components/Cell/Cell";
import CellAxis from "@/components/Cell/CellAxis";
import Header from "@/components/Header/Header";
import Popup from "@/components/Popup/Popup";

import { numberToChar } from "@/utils/number-to-char";

import styles from "./SheetsContainer.module.scss";

const numberOfColumns = 30;
const numberOfRows = 100;

function SheetsContainer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (!modalRef.current) {
      return;
    }

    const dialog = modalRef.current as HTMLDialogElement;

    const timeoutId = setTimeout(() => {
      setIsModalOpen(false);
      dialog.close();
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [isModalOpen]);

  const onOpenModal = useCallback(() => {
    if (modalRef.current) {
      setIsModalOpen(true);
      const dialog = modalRef.current as HTMLDialogElement;
      dialog.showModal();
    }
  }, []);

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
              onSelectCell={selectCell}
              onOpenModal={onOpenModal}
            />
          </td>
        ))}
      </tr>
    ));
  }

  return (
    <main className={styles.container}>
      <Header />

      <Popup ref={modalRef} open={isModalOpen} />

      <table className={styles.table}>
        <thead>{renderTableHeaders()}</thead>
        <tbody>{renderTableRows()}</tbody>
      </table>
    </main>
  );
}

export default SheetsContainer;
