import { CssBaseline } from "@mui/material";
import type { AppProps } from "next/app";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>LTSupportTool</title>
      </Head>
      <div>
        <CssBaseline />
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default MyApp;
