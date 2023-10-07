import Share from "./components/Share/Share";
import SheetsContainer from "./components/SheetsContainer/SheetsContainer";
import { SheetsProvider } from "./context/sheet";

function App() {
  const sheetId = "1209fa8d-0492-4808-904d-b4697fbea2ec";

  return (
    <SheetsProvider sheetId={sheetId}>
      <div>
        <h1>Ola mundo</h1>
        <SheetsContainer />
      </div>

      <Share sheetId={sheetId}>Share</Share>
    </SheetsProvider>
  );
}

export default App;
