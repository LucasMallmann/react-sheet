import { RecoilRoot } from "recoil";
import SheetsContainer from "./components/SheetsContainer/SheetsContainer";

function App() {
  return (
    <RecoilRoot>
      <div>
        <h1>Ola mundo</h1>
        <SheetsContainer />
      </div>
    </RecoilRoot>
  );
}

export default App;
