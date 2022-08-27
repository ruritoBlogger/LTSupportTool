import Document, { Head, Html, Main, NextScript } from "next/document";

interface CustomDocumentInterface {
  url: string;
  title: string;
  description: string;
}

class MyDocument extends Document implements CustomDocumentInterface {
  render() {
    return (
      <Html lang="ja-JP">
        <Head>
          <meta charSet="utf-8" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <script src="./live2dcubismcore.min.js" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
