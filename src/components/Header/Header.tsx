import Share from "@/components/Share/Share";

import logo from "@/assets/logo.svg";
import functionLogo from "@/assets/fx-icon.png";
import styles from "./HeaderStyles.module.scss";
import { useSheetsContext } from "@/context/Sheet";

type Props = {
  selectedCellId: string;
};

function Header({ selectedCellId }: Props) {
  const { cells } = useSheetsContext();
  const selectedCell = cells?.[selectedCellId];
  const formula = selectedCell?.formula || "";

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <div>
          <a href="https://www.getampla.com/" target="_blank">
            <img src={logo} alt="logo" width={125} height={44} />
          </a>
          <h1>Untlited Spreadsheet</h1>
        </div>
        <div className={styles.function}>
          <img src={functionLogo} width={20} height={20} />
          <span>{formula}</span>
        </div>
      </div>

      <div className={styles.share}>
        <Share />
      </div>
    </header>
  );
}

export default Header;
