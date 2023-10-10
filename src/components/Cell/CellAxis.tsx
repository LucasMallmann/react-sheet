import classes from "./Cell.module.scss";

type Props = {
  children?: React.ReactNode | string;
  scope?: string;
  highlight?: boolean;
};

function CellAxis({ children, highlight = false, ...props }: Props) {
  const cellClass = highlight ? classes.highlight : "";
  return (
    <th className={cellClass} {...props}>
      {children}
    </th>
  );
}

export default CellAxis;
