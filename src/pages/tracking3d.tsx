import { css } from "@emotion/css";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import { SWRConfig } from "swr";

const Tracking3DComponent = dynamic(() => import("@components/Tracking3D"), {
  ssr: false,
});

const Tracking3D: NextPage = () => {
  return (
    <SWRConfig value={{ suspense: true }}>
      <div className={rootStyle}>
        <Tracking3DComponent />
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

export default Tracking3D;
