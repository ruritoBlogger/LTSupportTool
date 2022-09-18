import { css } from "@emotion/css";
import { Button } from "@mui/material";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { SWRConfig } from "swr";

const PresenterToolPage: NextPage = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const initializeSocket = async (): Promise<void> => {
    await fetch("/api/socket");
    const generatedSocket = io();
    setSocket(generatedSocket);
  };

  useEffect(() => {
    initializeSocket();
  }, []);

  const handleStartTimerClick = () => {
    if (socket) {
      socket.emit("startTime", true);
    } else {
      initializeSocket();
    }
  };

  const handleStopTimerClick = () => {
    if (socket) {
      socket.emit("stopTime", true);
    } else {
      initializeSocket();
    }
  };

  const handleResetTimerClick = () => {
    if (socket) {
      socket.emit("resetTime", true);
    } else {
      initializeSocket();
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
