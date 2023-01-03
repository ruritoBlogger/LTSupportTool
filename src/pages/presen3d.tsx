import dynamic from "next/dynamic";
import { NextPage } from "next";
import { css } from "@emotion/css";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { SWRConfig } from "swr";
import GoogleSlide from "@components/GoogleSlide";

const TrackingComponent = dynamic(() => import("@components/Tracking3D"), {
  ssr: false,
});

const Presen3DPage: NextPage = () => {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    const socket = io();

    socket.on("listenSlideURL", (msg) => {
      setUrl(msg);
    });
  }, [setUrl]);

  return (
    <SWRConfig value={{ suspense: true }}>
      <div className={rootStyle}>
        <div className={presenStyle}>
          <GoogleSlide url={url} />
        </div>
        <div className={modelStyle}>
          <TrackingComponent />
        </div>
      </div>
    </SWRConfig>
  );
};

const rootStyle = css`
  && {
    display: grid;
    height: 100vh;
    width: 100vw;
  }
`;

const presenStyle = css`
  && {
    width: 100vw;
    height: 100vh;
    grid-area: 1/2;
  }
`;

const modelStyle = css`
  && {
    width: 50%;
    height: 70%;
    grid-area: 1/2;
    justify-self: end;
    align-self: end;
  }
`;

export default Presen3DPage;
