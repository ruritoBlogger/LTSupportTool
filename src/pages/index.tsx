import { css } from "@emotion/css";
import { NextPage } from "next";
import { SWRConfig } from "swr";
import { Grid } from "@mui/material";
import CustomCard from "@components/Card";

const App: NextPage = () => {
  return (
    <SWRConfig value={{ suspense: true }}>
      <div className={rootStyle}>
        <Grid container item spacing={2}>
          <Grid item className={cardStyle}>
            <CustomCard>
              <CustomCard.Media
                imagePath={"/tracking3d.png"}
                imageAltText={"VRMを用いた3Dトラッキングのデモ画像"}
              />
              <CustomCard.Content subtitle={"VRMを用いたデモ"}>
                <>
                  プレゼンツールなどで使用している VRM
                  モデルを操作するデモです。
                  Webカメラを通して取得した顔の表情や腕などの情報を元に VRM
                  のモデルを操作することが出来ます。
                </>
              </CustomCard.Content>
            </CustomCard>
          </Grid>
          <Grid item className={cardStyle}>
            <CustomCard>
              <CustomCard.Media
                imagePath={"/tracking2d.png"}
                imageAltText={"Live2Dを用いた2Dトラッキングのデモ画像"}
              />
              <CustomCard.Content subtitle={"Live2Dを用いたデモ"}>
                <>
                  プレゼンツールなどで使用している Live2D
                  モデルを操作するデモです。
                  Webカメラを通して取得した顔の表情を元に Live2D
                  のモデルを操作することが出来ます。
                </>
              </CustomCard.Content>
            </CustomCard>
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
