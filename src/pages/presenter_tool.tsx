import { css } from "@emotion/css";
import { Button, Stack } from "@mui/material";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { SWRConfig } from "swr";
import GoogleSlideForm from "@components/GoogleSlideForm";

const PresenterToolPage: NextPage = () => {
  const [isStart, setIsStart] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const f = async () => {
      await fetch("/api/socket");
      setSocket(io());
    };
    f();
  }, []);

  const handleStartTimerClick = () => {
    if (socket && !isStart) {
      socket.emit("startTime", true);
      setIsStart(true);
    }
  };

  const handleStopTimerClick = () => {
    if (socket) {
      socket.emit("stopTime", true);
      setIsStart(false);
    }
  };

  const handleResetTimerClick = () => {
    if (socket) {
      socket.emit("resetTime", true);
      setIsStart(false);
    }
  };

  const handleURLFormSubmit = (url: string) => {
    if (socket) {
      socket.emit("slideURL", url);
    }
  };

  return (
    <SWRConfig value={{ suspense: true }}>
      <div className={rootStyle}>
        <Stack direction={"row"} spacing={2}>
          <p>発表者ツール</p>
          <Button onClick={handleStartTimerClick}>スタート</Button>
          <Button onClick={handleStopTimerClick}>ストップ</Button>
          <Button onClick={handleResetTimerClick}>リセット</Button>
          <GoogleSlideForm onSubmit={handleURLFormSubmit} />
        </Stack>
      </div>
    </SWRConfig>
  );
};

const rootStyle = css`
  && {
    height: 80vh;
    width: 80vw;
    margin: 10vw 10vh;
  }
`;

export default PresenterToolPage;
