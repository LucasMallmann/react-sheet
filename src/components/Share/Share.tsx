import { useSheetsContext } from "@/context/sheet";

import styles from "./ShareStyle.module.scss";

type Props = {
  children: React.ReactNode;
};

function Share({ children }: Props) {
  const { saveToLocalStorage } = useSheetsContext();

  return (
    <button
      type="button"
      className={styles.button}
      onClick={() => saveToLocalStorage()}
    >
      {children}
    </button>
  );
}

export default Share;
