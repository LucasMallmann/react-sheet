import SheetsContainer from "./components/SheetsContainer/SheetsContainer";
import { SheetsProvider } from "./context/Sheet";

function App() {
  return (
    <SheetsProvider>
      <SheetsContainer />
    </SheetsProvider>
  );
}

export default App;
