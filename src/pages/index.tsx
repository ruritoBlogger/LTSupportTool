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
            <CustomCard url={"/tracking3d"}>
              <CustomCard.Media
                size={"normal"}
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
            <CustomCard url={"/tracking2d"}>
              <CustomCard.Media
                size={"normal"}
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
          <Grid item className={cardStyle}>
            <CustomCard url={"/presenter_tool"}>
              <CustomCard.Media
                size={"normal"}
                imagePath={"/tool.png"}
                imageAltText={"プレゼンページで使用するサポートツール"}
              />
              <CustomCard.Content subtitle={"発表者ツール"}>
                <>
                  プレゼンページの挙動を操作するページです。
                  プレゼンページにて設定されるタイマーの開始・ストップ・リセットなどを行うことが出来ます。
                  またプレゼンページにて表示するスライドの url
                  の設定も行うことが出来ます。
                  別ブラウザを用いたプレゼンページ・発表者ツールページの同時表示にも対応しています。
                </>
              </CustomCard.Content>
            </CustomCard>
          </Grid>
          <Grid item className={cardStyle}>
            <CustomCard url={"/presen"}>
              <CustomCard.Media
                size={"large"}
                imagePath={"/presen_2d.png"}
                imageAltText={"Live2Dを用いたプレゼンツール"}
              />
              <CustomCard.Content subtitle={"Live2Dを用いたプレゼンツール"}>
                <>
                  Live2D モデルを用いたプレゼンツールです。
                  プレゼンの画面やタイマー・ Live2D モデルの表示が出来ます。
                  デモと同じ形で Live2D モデルを制御することが出来ます。
                  またタイマーは発表者ツールにて開始・ストップ・リセットなどを行うことが出来ます。
                  他にも表示するスライドの url
                  は発表者ツールから変更する事ができます。
                </>
              </CustomCard.Content>
            </CustomCard>
          </Grid>

          <Grid item className={cardStyle}>
            <CustomCard url={"/presen3d"}>
              <CustomCard.Media
                size={"large"}
                imagePath={"/presen_3d.png"}
                imageAltText={"VRMを用いたプレゼンツール"}
              />
              <CustomCard.Content subtitle={"VRMを用いたプレゼンツール"}>
                <>
                  VRM モデルを用いたプレゼンツールです。 プレゼンの画面や VRM
                  モデルの表示が出来ます。 デモと同じ形で VRM
                  モデルを制御することが出来ます。 また表示するスライドの url
                  は発表者ツールから変更する事ができます。
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
    height: 90vh;
    width: 80vw;
    margin: 5vh 10vw;
  }
`;

const cardStyle = css`
  && {
    width: 35vw;
    max-width: 400px;
  }
`;

export default App;
