import Cell from "../Cell/Cell";
import CellAxis from "../Cell/CellAxis";
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
        {index}
      </CellAxis>
    );
  }

  function buildTableRows(rowIndex: number) {
    return (
      <tr key={rowIndex}>
        <CellAxis>{rowIndex + 1}</CellAxis>
        {[...Array(numberOfColumns)].map((_, columnIndex) => {
          return (
            <td key={columnIndex}>
              <Cell id={`${rowIndex}-${columnIndex}`} />
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
        {[...Array(numberOfRows)].map((_, rowIndex) =>
          buildTableRows(rowIndex)
        )}
      </table>
    </div>
  );
}

export default SheetsContainer;
