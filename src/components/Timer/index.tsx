import { css } from "@emotion/css";
import { useTimer } from "@hooks/useTimer";
import React, { useEffect } from "react";
import { io } from "socket.io-client";

const Timer = (): JSX.Element => {
  const { Timer: Countdown, startTime, stopTime, resetTime } = useTimer();

  const initializeSocket = async (): Promise<void> => {
    await fetch("/api/socket");
    const generatedSocket = io();

    generatedSocket.on("listenStart", () => {
      startTime();
    });

    generatedSocket.on("listenStop", () => {
      stopTime();
    });

    generatedSocket.on("listenReset", () => {
      resetTime();
    });
  };

  useEffect(() => {
    initializeSocket();
  }, []);

  return (
    <div className={rootStyle}>
      <Countdown />
    </div>
  );
};

const rootStyle = css`
  && {
    width: 100%;
    height: 100%;
    display: flex;
  }
`;

export default Timer;
