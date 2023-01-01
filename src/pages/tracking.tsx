import { css } from "@emotion/css";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import { SWRConfig } from "swr";

const TrackingComponent = dynamic(() => import("@components/Tracking"), {
  ssr: false,
});

const Tracking: NextPage = () => {
  return (
    <SWRConfig value={{ suspense: true }}>
      <div className={rootStyle}>
        <TrackingComponent showCamera />
      </div>
    </SWRConfig>
  );
};

const rootStyle = css`
  && {
    width: 100vw;
    height: 95vh;
    margin: auto;
    background-color: white;
  }
`;

export default Tracking;
