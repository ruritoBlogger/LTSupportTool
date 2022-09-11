import { css } from "@emotion/css";
import { useTimer } from "@hooks/useTimer";
import { Button } from "@mui/material";
import { NextPage } from "next";
import { SWRConfig } from "swr";

const PresenterToolPage: NextPage = () => {
  const { startTime, stopTime, resetTime } = useTimer();

  const handleStartTimerClick = () => {
    startTime();
  };

  const handleStopTimerClick = () => {
    stopTime();
  };

  const handleResetTimerClick = () => {
    resetTime();
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
