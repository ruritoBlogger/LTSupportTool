import { css } from "@emotion/css";
import { useSWRCountDownApiState } from "@state/useSWRCountDownApiState";
import { useSWRTimerState } from "@state/useSWRTimerState";
import React from "react";
import Countdown from "react-countdown";

interface UseTimerReturn {
  Timer: () => JSX.Element;
  startTime: () => void;
  stopTime: () => void;
  resetTime: () => void;
}

// TODO: 時刻の設定周りはリファクタしたい
export const useTimer = (): UseTimerReturn => {
  const nowTime = new Date();
  nowTime.setMinutes(nowTime.getMinutes() + 5);
  const { time: currentTime, setTime } = useSWRTimerState(nowTime);
  const { api: countDownApi, setApi: setCountDownApi } =
    useSWRCountDownApiState(null);

  // @url: https://github.com/ndresx/react-countdown/blob/master/examples/src/CountdownApi.tsx
  const setRef = (countDown: Countdown | null): void => {
    if (countDown && !countDownApi) {
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
    nowTime.setMinutes(nowTime.getMinutes() + 5);
    setTime(nowTime);
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
