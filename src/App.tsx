import { RecoilRoot } from "recoil";
import SheetsContainer from "./components/SheetsContainer/SheetsContainer";
import { SheetsProvider } from "./context/sheet";

function App() {
  return (
    <RecoilRoot>
      <SheetsProvider>
        <div>
          <h1>Ola mundo</h1>
          <SheetsContainer />
        </div>
      </SheetsProvider>
    </RecoilRoot>
  );
}

export default App;
