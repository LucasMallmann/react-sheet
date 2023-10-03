import Cell from "../Cell/Cell";
import classes from "./SheetsContainer.module.scss";

const numberOfColumns = 10;
const numberOfRows = 10;

const rows = [...Array(numberOfRows)];
const columns = [...Array(numberOfColumns)];

function SheetsContainer() {
  return (
    <div className={classes.container}>
      <table>
        <thead>
          <tr>
            {columns.map((_, columnIndex) => (
              <th key={columnIndex} scope="col">
                {columnIndex}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((_, rowIndex) => {
            return (
              <tr key={rowIndex}>
                <th>{rowIndex + 1}</th>
                {columns.map((_, columnIndex) => {
                  return (
                    <td key={columnIndex}>
                      <Cell id={`${rowIndex}-${columnIndex}`} />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default SheetsContainer;
