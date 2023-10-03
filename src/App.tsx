import { RecoilRoot } from "recoil";
import Cell from "@/components/Cell/Cell";

function App() {
  return (
    <RecoilRoot>
      <div>
        <h1>Ola mundo</h1>
        <section>
          <Cell />
        </section>
      </div>
    </RecoilRoot>
  );
}

export default App;
