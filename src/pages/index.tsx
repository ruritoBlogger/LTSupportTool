import { Container } from "@mui/material";
import { NextPage } from "next";
import { SWRConfig } from "swr";

const App: NextPage = () => {
  return (
    <SWRConfig value={{ suspense: true }}>
      <Container maxWidth={"lg"}>
        <p>hello world!!!</p>
      </Container>
    </SWRConfig>
  );
};

export default App;
