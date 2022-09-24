import React from "react";

const GoogleSlide = ({ url }: { url: string }): JSX.Element => {
  return (
    <>
      <iframe src={url} width={"100%"} height={"100%"} />
    </>
  );
};

export default GoogleSlide;
