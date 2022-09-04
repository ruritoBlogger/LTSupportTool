import React from "react";

// TODO: 引数を受け取れるように
const GoogleSlide = (): JSX.Element => {
  const url =
    "https://docs.google.com/presentation/d/1253Vsfe8jvjbtqR7hx24Gb5tmdL4Ks35g-K1Zu5SsQc" +
    "/embed?";

  return (
    <>
      <iframe src={url} width={"100%"} height={"100%"} />
    </>
  );
};

export default GoogleSlide;
