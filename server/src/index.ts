import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);

// const io = new Server(httpServer, {
//   cors: {
//     origin: "*",
//   },
// });
httpServer.listen(4000, () => {
  console.log("🚀 Server running on http://localhost:4000");
});
