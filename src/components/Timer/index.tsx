import { css } from "@emotion/css";
import { useTimer } from "@hooks/useTimer";
import React from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

const Timer = (): JSX.Element => {
  const { Timer: Countdown, startTime, stopTime, resetTime } = useTimer();

  const initializeSocket = async (): Promise<void> => {
    if (socket) {
      return;
    }

    socket = io();

    socket.on("listenStart", () => {
      startTime();
    });

    socket.on("listenStop", () => {
      stopTime();
    });

    socket.on("listenReset", () => {
      resetTime();
    });
  };

  initializeSocket();

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
