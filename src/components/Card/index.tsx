import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

export const CustomCard = (): JSX.Element => {
  return (
    <>
      <Card>
        <CardActionArea>
          <CardMedia
            component="img"
            height="140"
            image="/tracking3d.png"
            alt="VRMを用いた3Dトラッキングのデモ画像"
          />
          <CardContent>
            <Typography variant={"h5"}>Live2Dを用いたデモ</Typography>
            <Typography variant={"body2"}>
              プレゼンツールなどで使用している Live2D モデルを操作するデモです。
              Webカメラを通して取得した顔の表情を元に Live2D
              のモデルを操作することが出来ます。
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
};
