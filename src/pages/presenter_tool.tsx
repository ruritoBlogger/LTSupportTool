import { css } from "@emotion/css";
import { NextPage } from "next";
import { SWRConfig } from "swr";

const PresenterToolPage: NextPage = () => {
  return (
    <SWRConfig value={{ suspense: true }}>
      <div className={rootStyle}>
        <p>発表者ツール</p>
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

export default PresenterToolPage;
