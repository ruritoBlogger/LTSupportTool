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
          <Button>
            <Link legacyBehavior href={"/"}>
              <a style={{ textDecoration: "none" }}>トップページ</a>
            </Link>
          </Button>
          {isNotTracking2DPage && (
            <Button>
              <Link legacyBehavior href={"/tracking2d"}>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  2Dトラッキングデモ
                </a>
              </Link>
            </Button>
          )}
          {isNotTracking3DPage && (
            <Button>
              <Link legacyBehavior href={"/tracking3d"}>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  3Dトラッキングデモ
                </a>
              </Link>
            </Button>
          )}
        </Stack>
      </Paper>
    </>
  );
};

export default Navigator;
