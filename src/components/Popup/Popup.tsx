import React, { RefObject } from "react";
import styles from "./PopupStyles.module.scss";

type Props = {
  open?: boolean;
};

const Popup = React.forwardRef(({ open = false }: Props, ref) => {
  return (
    <dialog
      className={styles.dialog}
      ref={ref as RefObject<HTMLDialogElement>}
      open={open}
    >
      <p>This reference cannot be made! Try again</p>
    </dialog>
  );
});

export default Popup;
