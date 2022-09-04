import GoogleSlide from "@components/GoogleSlide";
import { css } from "@emotion/css";

const PresenLayout = (): JSX.Element => {
  return (
    <div className={GridStyle}>
      <div className={InnerGridStyle}>
        <Box>
          <GoogleSlide />
        </Box>
        <Box>
          <p>サイドバーの部分</p>
        </Box>
      </div>
      <Box>
        <p>下の部分</p>
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
    grid-template-columns: 85% 15%;
  }
`;

const InnerGridStyle = css`
  && {
    display: grid;
    grid-template-rows: 70% 30%;
  }
`;

const boxStyle = css`
  && {
    margin: 3px;
    border: 3px solid white;
  }
`;

const Box = ({ children }: { children: JSX.Element }): JSX.Element => (
  <div className={boxStyle}>{children}</div>
);

export default PresenLayout;
