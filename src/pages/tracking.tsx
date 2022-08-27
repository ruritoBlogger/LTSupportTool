import { Container } from "@mui/material";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import { SWRConfig } from "swr";

const TrackingComponent = dynamic(() => import("@components/Tracking"), {
  ssr: false,
});

const Tracking: NextPage = () => {
  return (
    <SWRConfig value={{ suspense: true }}>
      <Container maxWidth={"lg"}>
        <TrackingComponent />
      </Container>
    </SWRConfig>
  );
};

export default Tracking;
