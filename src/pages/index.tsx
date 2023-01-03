import PresenLayout from "@components/PresenLayout";
import Navigator from "@components/Navigator";
import { css } from "@emotion/css";
import { NextPage } from "next";
import { SWRConfig } from "swr";
import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import { CustomCard } from "@components/Card";

const App: NextPage = () => {
  return (
    <SWRConfig value={{ suspense: true }}>
      <div className={rootStyle}>
        <Grid container direction={"column"}>
          <Grid container item>
            <Grid item className={cardStyle}>
              <CustomCard
                imagePath={"/tracking3d.png"}
                imageAltText={"VRMを用いた3Dトラッキングのデモ画像"}
                title={"Live2Dを用いたデモ"}
              >
                <Typography variant={"body2"}>
                  プレゼンツールなどで使用している Live2D
                  モデルを操作するデモです。
                  Webカメラを通して取得した顔の表情を元に Live2D
                  のモデルを操作することが出来ます。
                </Typography>
              </CustomCard>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </SWRConfig>
  );
};

const rootStyle = css`
  && {
    height: 80vh;
    width: 80vw;
    margin: 10vh 10vw;
  }
`;

const cardStyle = css`
  && {
    width: 35vw;
    max-width: 400px;
  }
`;

export default App;
