import { css } from "@emotion/css";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import { SWRConfig } from "swr";
import Navigator from "@components/Navigator";

const Tracking3DComponent = dynamic(() => import("@components/Tracking3D"), {
  ssr: false,
});

const Tracking3D: NextPage = () => {
  return (
    <SWRConfig value={{ suspense: true }}>
      <div className={rootStyle}>
        <div className={hoverStyle}>
          <Navigator />
        </div>
        <Tracking3DComponent />
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

const hoverStyle = css`
  && {
    position: absolute;
    top: 0;
    left: 0;
  }
`;

export default Tracking3D;
