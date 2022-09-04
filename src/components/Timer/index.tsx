import { css } from "@emotion/css";
import React from "react";
import Countdown from "react-countdown";

interface TimerProps {
  time: Date;
}

const Timer = ({ time }: TimerProps): JSX.Element => {
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

  return (
    <div className={rootStyle}>
      <Countdown date={time} renderer={rerender} />
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

const timerStyle = css`
  && {
    flex: 0 1 auto;
    margin: auto;
    font-size: 80px;
  }
`;

export default Timer;
