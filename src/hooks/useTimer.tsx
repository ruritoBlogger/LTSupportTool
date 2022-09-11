import { css } from "@emotion/css";
import { useSWRTimerState } from "@state/useSWRTimerState";
import React, { useState } from "react";
import Countdown, { CountdownApi } from "react-countdown";

interface UseTimerReturn {
  Timer: () => JSX.Element;
  startTime: () => void;
  stopTime: () => void;
  resetTime: () => void;
}

export const useTimer = (): UseTimerReturn => {
  const initialTime = 60 * 5;
  const { time: currentTime, setTime } = useSWRTimerState(initialTime);
  const [countDownApi, setCountDownApi] = useState<CountdownApi | null>(null);

  // @url: https://github.com/ndresx/react-countdown/blob/master/examples/src/CountdownApi.tsx
  const setRef = (countDown: Countdown | null): void => {
    if (countDown) {
      setCountDownApi(countDown.getApi());
    }
  };

  const rerender = ({
    minutes,
    seconds,
  }: {
    minutes: number;
    seconds: number;
  }) => {
    return (
      <span className={timerStyle}>
        {minutes >= 10 ? minutes : `0${minutes}`}:
        {seconds >= 10 ? seconds : `0${seconds}`}
      </span>
    );
  };

  const Timer = (): JSX.Element => (
    <Countdown
      ref={setRef}
      autoStart={false}
      date={currentTime}
      renderer={rerender}
    />
  );

  const startTime = (): void => {
    countDownApi && countDownApi.start();
  };

  const stopTime = (): void => {
    countDownApi && countDownApi.stop();
  };

  const resetTime = (): void => {
    stopTime();
    setTime(initialTime);
  };

  return {
    Timer: Timer,
    startTime: startTime,
    stopTime: stopTime,
    resetTime: resetTime,
  };
};

const timerStyle = css`
  && {
    flex: 0 1 auto;
    margin: auto;
    font-size: 80px;
  }
`;
