import { css } from "@emotion/css";
import { Button } from "@mui/material";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { SWRConfig } from "swr";

const PresenterToolPage: NextPage = () => {
  const [isStart, setIsStart] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const f = async () => {
      await fetch("/api/socket");
      setSocket(io());
    };
    f();
  }, []);

  const handleStartTimerClick = () => {
    if (socket && !isStart) {
      socket.emit("startTime", true);
      setIsStart(true);
    }
  };

  const handleStopTimerClick = () => {
    if (socket && isStart) {
      socket.emit("stopTime", true);
      setIsStart(false);
    }
  };

  const handleResetTimerClick = () => {
    if (socket) {
      socket.emit("resetTime", true);
      setIsStart(false);
    }
  };

  return (
    <SWRConfig value={{ suspense: true }}>
      <div className={rootStyle}>
        <p>発表者ツール</p>
        <Button onClick={handleStartTimerClick}>スタート</Button>
        <Button onClick={handleStopTimerClick}>ストップ</Button>
        <Button onClick={handleResetTimerClick}>リセット</Button>
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
