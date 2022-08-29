import PresenLayout from "@components/PresenLayout";
import { NextPage } from "next";
import { SWRConfig } from "swr";

const App: NextPage = () => {
  return (
    <SWRConfig value={{ suspense: true }}>
      <PresenLayout />
    </SWRConfig>
  );
};

export default App;
