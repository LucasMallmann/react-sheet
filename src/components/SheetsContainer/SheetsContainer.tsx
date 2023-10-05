import Cell from "@/components/Cell/Cell";
import CellAxis from "@/components/Cell/CellAxis";
import { numberToChar } from "@/utils";
import classes from "./SheetsContainer.module.scss";

const numberOfColumns = 10;
const numberOfRows = 10;
const headerRowQuantity = 1;

function SheetsContainer() {
  function buildTableHeaders(index: number) {
    if (index === 0) {
      return <CellAxis key={index} scope="col"></CellAxis>;
    }
    return (
      <CellAxis key={index} scope="col">
        {numberToChar(index)}
      </CellAxis>
    );
  }

  function buildTableRows(rowIndex: number) {
    return (
      <tr key={rowIndex}>
        <CellAxis>{rowIndex + 1}</CellAxis>
        {[...Array(numberOfColumns)].map((_, columnIndex) => {
          const id = `${rowIndex}-${columnIndex}`;
          return (
            <td key={id}>
              <Cell id={id} />
            </td>
          );
        })}
      </tr>
    );
  }

  return (
    <div className={classes.container}>
      <table>
        <thead>
          <tr>
            {[...Array(numberOfColumns + headerRowQuantity)].map((_, index) =>
              buildTableHeaders(index)
            )}
          </tr>
        </thead>
        <tbody>
          {[...Array(numberOfRows)].map((_, rowIndex) =>
            buildTableRows(rowIndex)
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SheetsContainer;
