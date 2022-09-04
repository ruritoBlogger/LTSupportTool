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
        <TrackingComponent />
      </div>
    </SWRConfig>
  );
};

const rootStyle = css`
  && {
    width: 85vw;
    height: 85vh;
    margin: auto;
    background-color: white;
  }
`;

export default Tracking;
