import { useSheetsContext } from "@/context/sheet";

type Props = {
  children: React.ReactNode;
  sheetId: string;
};

function Share({ children }: Props) {
  const { saveToLocalStorage } = useSheetsContext();

  function shareSheet() {
    saveToLocalStorage();
  }

  return (
    <button
      type="button"
      style={{
        padding: "10px",
        backgroundColor: "blueviolet",
        cursor: "pointer",
      }}
      onClick={shareSheet}
    >
      {children}
    </button>
  );
}

export default Share;
