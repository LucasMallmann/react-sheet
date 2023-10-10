import SheetsContainer from "./components/SheetsContainer/SheetsContainer";
import { SheetsProvider } from "./context/sheet";

function App() {
  const sheetId = "1209fa8d-0492-4808-904d-b4697fbea2ec";

  return (
    <SheetsProvider sheetId={sheetId}>
      <SheetsContainer />
    </SheetsProvider>
  );
}

export default App;
