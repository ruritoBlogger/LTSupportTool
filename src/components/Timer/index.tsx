import { css } from "@emotion/css";
import { useTimer } from "@hooks/useTimer";
import React, { useEffect } from "react";
import { io } from "socket.io-client";

const Timer = (): JSX.Element => {
  const { Timer: Countdown, startTime, stopTime, resetTime } = useTimer();

  useEffect(() => {
    const socket = io();

    socket.on("listenStart", () => {
      startTime();
    });

    socket.on("listenStop", () => {
      stopTime();
    });

    socket.on("listenReset", () => {
      resetTime();
    });

    return function cleanup() {
      socket.disconnect();
    };
  }, [startTime, stopTime, resetTime]);

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
