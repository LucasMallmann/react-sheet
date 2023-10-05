import Cell from "@/components/Cell/Cell";
import CellAxis from "@/components/Cell/CellAxis";
import { numberToChar } from "@/utils";
import classes from "./SheetsContainer.module.scss";

const numberOfColumns = 10;
const numberOfRows = 10;

function SheetsContainer() {
  function renderTableHeaders() {
    return (
      <tr>
        <CellAxis key={0} scope="col"></CellAxis>
        {[...Array(numberOfColumns)].map((_, columnIndex) => (
          <CellAxis key={columnIndex + 1} scope="col">
            {numberToChar(columnIndex + 1)}
          </CellAxis>
        ))}
      </tr>
    );
  }

  function renderTableRows() {
    return [...Array(numberOfRows)].map((_, rowIndex) => (
      <tr key={rowIndex}>
        <CellAxis>{rowIndex + 1}</CellAxis>
        {[...Array(numberOfColumns)].map((_, columnIndex) => (
          <td key={`${rowIndex}-${columnIndex}`}>
            <Cell id={`${rowIndex}-${columnIndex}`} />
          </td>
        ))}
      </tr>
    ));
  }

  return (
    <div className={classes.container}>
      <table>
        <thead>{renderTableHeaders()}</thead>
        <tbody>{renderTableRows()}</tbody>
      </table>
    </div>
  );
}

export default SheetsContainer;
