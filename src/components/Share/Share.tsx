import { useSheetsContext } from "@/context/sheet";

import styles from "./ShareStyle.module.scss";
import { generateUUID } from "@/utils/uuid";

type Props = {
  children: React.ReactNode;
};

function Share({ children }: Props) {
  const { saveToLocalStorage } = useSheetsContext();

  async function handleClick() {
    const url = window.location.href;
    const id = generateUUID();
    const generatedUrl = `${url}${id}`;

    saveToLocalStorage(id);

    console.log("generatedUrl", generatedUrl);

    if ("clipboard" in navigator) {
      await navigator.clipboard.writeText(generatedUrl);
    } else {
      document.execCommand("copy", true, generatedUrl);
    }
  }

  return (
    <button type="button" className={styles.button} onClick={handleClick}>
      {children}
    </button>
  );
}

export default Share;
