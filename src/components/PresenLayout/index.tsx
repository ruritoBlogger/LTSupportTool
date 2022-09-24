import GoogleSlide from "@components/GoogleSlide";
import { css } from "@emotion/css";

interface PresenLayoutProps {
  Sidebar: () => JSX.Element;
  url: string;
}

const PresenLayout = ({ Sidebar, url }: PresenLayoutProps): JSX.Element => {
  return (
    <div className={GridStyle}>
      <div className={InnerGridStyle}>
        <Box>
          <GoogleSlide url={url} />
        </Box>
        <Box>
          <Sidebar />
        </Box>
      </div>
      <Box>
        <div className={innerTextStyle}>
          <p className={textStyle}>宝くじLT 始まるよ～～～</p>
        </div>
      </Box>
    </div>
  );
};

const GridStyle = css`
  && {
    width: 100%;
    height: 100%;
    background-color: black;
    display: grid;
    grid-template-rows: 80% 20%;
    color: white;
  }
`;

const InnerGridStyle = css`
  && {
    display: grid;
    grid-template-columns: 75% 25%;
  }
`;

const boxStyle = css`
  && {
    margin: 3px;
    border: 3px solid white;
  }
`;

const innerTextStyle = css`
  && {
    width: 80%;
    margin: 0 auto;
    display: flex;
  }
`;

const textStyle = css`
  && {
    font-size: 40px;
  }
`;

const Box = ({ children }: { children: JSX.Element }): JSX.Element => (
  <div className={boxStyle}>{children}</div>
);

export default PresenLayout;
