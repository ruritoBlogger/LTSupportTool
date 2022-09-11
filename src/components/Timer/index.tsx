import { css } from "@emotion/css";
import { useTimer } from "@hooks/useTimer";
import React from "react";

const Timer = (): JSX.Element => {
  const { Timer: Countdown } = useTimer();

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
