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
              <CustomCard />
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
