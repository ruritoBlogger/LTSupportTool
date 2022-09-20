import { css } from "@emotion/css";
import { useCountdown } from "@hooks/useCountDown";
import React from "react";

interface UseTimerReturn {
  Timer: () => JSX.Element;
  startTime: () => void;
  stopTime: () => void;
  resetTime: () => void;
}

// TODO: 時刻の設定周りはリファクタしたい
export const useTimer = (): UseTimerReturn => {
  const {
    time: { minutes, seconds },
    start,
    stop,
  } = useCountdown(5);

  const Timer = (): JSX.Element => (
    <>
      <span className={timerStyle}>
        {minutes >= 10 ? minutes : `0${minutes}`}:
        {seconds >= 10 ? seconds : `0${seconds}`}
      </span>
    </>
  );

  return {
    Timer: Timer,
    startTime: start,
    stopTime: stop,
    resetTime: () => {
      return;
    },
  };
};

const timerStyle = css`
  && {
    flex: 0 1 auto;
    margin: auto;
    font-size: 80px;
  }
`;
