import PresenLayout from "@components/PresenLayout";
import { css } from "@emotion/css";
import { NextPage } from "next";
import { SWRConfig } from "swr";

const App: NextPage = () => {
  return (
    <SWRConfig value={{ suspense: true }}>
      <div className={rootStyle}>
        <PresenLayout Sidebar={() => <p>サイドバー(予定)</p>} />
      </div>
    </SWRConfig>
  );
};

const rootStyle = css`
  && {
    height: 100vh;
    width: 100vw;
  }
`;

export default App;
