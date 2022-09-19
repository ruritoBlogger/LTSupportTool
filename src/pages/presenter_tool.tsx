import { css } from "@emotion/css";
import { Button } from "@mui/material";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { SWRConfig } from "swr";

let socket: Socket | null = null;

const PresenterToolPage: NextPage = () => {
  const initializeSocket = async (): Promise<void> => {
    if (socket) {
      return;
    }

    await fetch("/api/socket");
    socket = io();
  };

  useEffect(() => {
    initializeSocket();
  }, []);

  const handleStartTimerClick = () => {
    if (socket) {
      socket.emit("startTime", true);
    }
  };

  const handleStopTimerClick = () => {
    if (socket) {
      socket.emit("stopTime", true);
    }
  };

  const handleResetTimerClick = () => {
    if (socket) {
      socket.emit("resetTime", true);
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
