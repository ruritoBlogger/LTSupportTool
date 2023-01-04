import PresenLayout from "@components/PresenLayout";
import { css } from "@emotion/css";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import Timer from "@components/Timer";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const TrackingComponent = dynamic(() => import("@components/Tracking"), {
  ssr: false,
});

// TODO: コンポーネントとかに切り出したい
const TrackingLayout = () => {
  return (
    <div className={layoutStyle}>
      <Timer />
      <div className={innerLayoutStyle}>
        <TrackingComponent />
      </div>
    </div>
  );
};

const PresenPage: NextPage = () => {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    const socket = io();

    socket.on("listenSlideURL", (msg) => {
      setUrl(msg);
    });
  }, [setUrl]);

  return (
    <div className={rootStyle}>
      <PresenLayout Sidebar={TrackingLayout} url={url} />
    </div>
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
