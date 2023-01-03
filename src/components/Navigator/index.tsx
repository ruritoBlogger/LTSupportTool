import React from "react";
import { Button, Paper, Stack } from "@mui/material";
import { useRouter } from "next/router";

const Navigator = (): JSX.Element => {
  const router = useRouter();
  const pathname = router.pathname;
  const isNotTracking2DPage = pathname.indexOf("tracking2d") === -1;
  const isNotTracking3DPage = pathname.indexOf("tracking3d") === -1;

  // TODO: ボタンがクリックされた時の遷移処理を実装する

  return (
    <>
      <Paper>
        <Stack direction={"row"} spacing={1}>
          {isNotTracking2DPage && <Button>2Dトラッキングデモ</Button>}
          {isNotTracking3DPage && <Button>3Dトラッキングデモ</Button>}
        </Stack>
      </Paper>
    </>
  );
};

export default Navigator;
