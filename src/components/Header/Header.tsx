import Share from "@/components/Share/Share";

import logo from "@/assets/logo.svg";
import styles from "./HeaderStyles.module.scss";

function Header() {
  return (
    <header className={styles.container}>
      <div className={styles.logo}>
        <a href="https://www.getampla.com/" target="_blank">
          <img src={logo} alt="logo" />
        </a>
        <h1>Untlited Spreadsheet</h1>
      </div>

      <div className={styles.share}>
        <Share />
      </div>
    </header>
  );
}

export default Header;
