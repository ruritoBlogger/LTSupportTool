import { NextApiRequest, NextApiResponse } from "next";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  // TODO: requestからデータを取得する
  res.status(200);

  // TODO: 適切なresponseを返す
  req.on("data", (_chunk: any) => {
    res.write("test");
  });

  // TODO: 適切なresponseを返す
  req.on("end", (_chunk: any) => {
    if (res.writableEnded) return;
    res.send("Ended");
  });
};

export default handler;
