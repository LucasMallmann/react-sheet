import classes from "./Cell.module.scss";

type Props = {
  children?: React.ReactNode | string;
  scope?: string;
};

function CellAxis({ children, ...props }: Props) {
  return (
    <th className={classes.axis} {...props}>
      {children}
    </th>
  );
}

export default CellAxis;
