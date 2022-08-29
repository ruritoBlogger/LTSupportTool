import { Grid } from "@mui/material";
import { Box } from "@mui/system";

const PresenLayout = (): JSX.Element => {
  return (
    <>
      <Grid container direction={"column"}>
        <Grid container item xs={9}>
          <Grid item xs={8}>
            <Box>
              <p>プレゼンの部分</p>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box>
              <p>サイドバーの部分</p>
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={3}>
          <Box>
            <p>下の部分</p>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default PresenLayout;
