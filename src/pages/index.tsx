import PresenLayout from "@components/PresenLayout";
import Navigator from "@components/Navigator";
import { css } from "@emotion/css";
import { NextPage } from "next";
import { SWRConfig } from "swr";

const App: NextPage = () => {
  return (
    <SWRConfig value={{ suspense: true }}>
      <div className={rootStyle}>
        <div className={hoverStyle}>
          <Navigator />
        </div>
        <PresenLayout url={""} Sidebar={() => <p>サイドバー(予定)</p>} />
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

const hoverStyle = css`
  && {
    position: absolute;
    top: 0;
    left: 0;
  }
`;

export default App;
