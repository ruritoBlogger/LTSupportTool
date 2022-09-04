import PresenLayout from "@components/PresenLayout";
import { css } from "@emotion/css";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import { SWRConfig } from "swr";

const TrackingComponent = dynamic(() => import("@components/Tracking"), {
  ssr: false,
});

// TODO: コンポーネントとかに切り出したい
const TrackingLayout = () => {
  return (
    <div className={layoutStyle}>
      <div />
      <div className={innerLayoutStyle}>
        <TrackingComponent />
      </div>
    </div>
  );
};

const PresenPage: NextPage = () => {
  return (
    <SWRConfig value={{ suspense: true }}>
      <div className={rootStyle}>
        <PresenLayout Sidebar={TrackingLayout} />
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

const layoutStyle = css`
  && {
    display: grid;
    height: 100%;
    width: 100%;
    grid-template-rows: auto 75%;
  }
`;

const innerLayoutStyle = css`
  && {
    width: 94%;
    height: 94%;
    border: 1px solid white;
    margin: 3%;
  }
`;

export default PresenPage;
