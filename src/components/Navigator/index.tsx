import React from "react";
import { Button, Paper, Stack } from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";

const Navigator = (): JSX.Element => {
  const router = useRouter();
  const pathname = router.pathname;
  const isNotTracking2DPage = pathname.indexOf("tracking2d") === -1;
  const isNotTracking3DPage = pathname.indexOf("tracking3d") === -1;

  return (
    <>
      <Paper>
        <Stack direction={"row"} spacing={1}>
          {isNotTracking2DPage && (
            <Button>
              <Link href={"/tracking2d"} style={{ textDecoration: "none" }}>
                2Dトラッキングデモ
              </Link>
            </Button>
          )}
          {isNotTracking3DPage && (
            <Button>
              <Link href={"/tracking3d"} style={{ textDecoration: "none" }}>
                3Dトラッキングデモ
              </Link>
            </Button>
          )}
        </Stack>
      </Paper>
    </>
  );
};

export default Navigator;
