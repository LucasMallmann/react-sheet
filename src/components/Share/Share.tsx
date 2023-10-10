import { useSheetsContext } from "@/context/sheet";

type Props = {
  children: React.ReactNode;
};

function Share({ children }: Props) {
  const { saveToLocalStorage } = useSheetsContext();

  return (
    <button
      type="button"
      style={{
        padding: "10px",
        backgroundColor: "blueviolet",
        cursor: "pointer",
      }}
      onClick={() => saveToLocalStorage()}
    >
      {children}
    </button>
  );
}

export default Share;
