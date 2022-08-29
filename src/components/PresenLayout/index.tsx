import { css } from "@emotion/css";
import { Grid } from "@mui/material";

const PresenLayout = (): JSX.Element => {
  return (
    <>
      <Grid container direction={"column"} className={rootStyle}>
        <Grid container item xs={9}>
          <Grid item xs={9} className={boxStyle}>
            <p>プレゼンの部分</p>
          </Grid>
          <Grid item xs={3} className={boxStyle}>
            <p>サイドバーの部分</p>
          </Grid>
        </Grid>
        <Grid item xs={3} className={boxStyle}>
          <p>下の部分</p>
        </Grid>
      </Grid>
    </>
  );
};

const rootStyle = css`
  && {
    height: 100%;
    width: 100%;
    background-color: black;
  }
`;

const boxStyle = css`
  && {
    margin: 3px;
    border: 3px solid white;
  }
`;

export default PresenLayout;
