import { useEffect, useState } from "react";
import { useSheetsContext } from "@/context/Sheet";

import styles from "./ShareStyle.module.scss";
import { generateUUID } from "@/utils/uuid";
import { unsafeCopy } from "@/utils/unsafe-copy";

function Share() {
  const [text, setText] = useState("Share");
  const { saveToLocalStorage } = useSheetsContext();

  async function handleClick() {
    const url = window.location.host;
    const protocol = window.location.protocol;
    const id = generateUUID();
    const generatedUrl = `${protocol}//${url}/${id}`;

    saveToLocalStorage(id);

    if ("clipboard" in navigator) {
      await navigator.clipboard.writeText(generatedUrl);
    } else {
      unsafeCopy(generatedUrl);
    }

    setText("Copied to clipboard!");
  }

  useEffect(() => {
    const timetoutId = setTimeout(() => {
      setText("Share");
    }, 2000);

    return () => clearTimeout(timetoutId);
  }, [text]);

  return (
    <button type="button" className={styles.button} onClick={handleClick}>
      {text}
    </button>
  );
}

export default Share;
