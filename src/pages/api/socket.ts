import { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";

const Handler = (req: NextApiRequest, res: NextApiResponse<string>) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);
    res.socket.server.io = io;
  }

  res.socket.server.io.on("connection", (socket) => {
    socket.on("startTime", (_msg) => {
      socket.broadcast.emit("listenStart", true);
    });
    socket.on("stopTime", (_msg) => {
      socket.broadcast.emit("listenStop", true);
    });
    socket.on("resetTime", (_msg) => {
      socket.broadcast.emit("listenReset", true);
    });
    socket.on("slideURL", (msg) => {
      socket.broadcast.emit("listenSlideURL", msg);
    });
  });
  res.end();
};

export default Handler;
