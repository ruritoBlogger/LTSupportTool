import { css } from "@emotion/css";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import Navigator from "@components/Navigator";

const TrackingComponent = dynamic(() => import("@components/Tracking"), {
  ssr: false,
});

const Tracking2D: NextPage = () => {
  return (
    <div className={rootStyle}>
      <div className={hoverStyle}>
        <Navigator />
      </div>
      <TrackingComponent showCamera />
    </div>
  );
};

const rootStyle = css`
  && {
    width: 100vw;
    height: 95vh;
    margin: auto;
    position: relative;
    background-color: white;
  }
`;

const hoverStyle = css`
  && {
    position: absolute;
    top: 0;
    left: 0;
  }
`;

export default Tracking2D;
