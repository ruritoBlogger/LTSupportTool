import { css } from "@emotion/css";
import { Button } from "@mui/material";
import { NextPage } from "next";
import { useState } from "react";
import { SWRConfig } from "swr";

const PresenterToolPage: NextPage = () => {
  const [message, setMessage] = useState<string>("");
  // TODO: タイマーをスタートする
  const handleClick = () => {
    setMessage("clicked!!!");
  };

  return (
    <SWRConfig value={{ suspense: true }}>
      <div className={rootStyle}>
        <p>発表者ツール</p>
        <Button onClick={handleClick}>スタート</Button>
        <p>{message}</p>
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
