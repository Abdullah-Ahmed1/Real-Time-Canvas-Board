import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" }
});

type Rect = { id: string; x: number; y: number; width: number; height: number; color: string };

let rectangles: Rect[] = [];

io.on("connection", (socket) => {
  console.log("client connected", socket.id);

  // Send existing rectangles on connection
  socket.emit("init", rectangles);

  socket.on("rectangle:add", (rect: Rect) => {
    rectangles.push(rect);
    io.emit("rectangle:added", rect);
  });

  socket.on("rectangle:move", (updated: Rect) => {
    rectangles = rectangles.map(r => r.id === updated.id ? updated : r);
    socket.broadcast.emit("rectangle:moved", updated);
  });

  socket.on("disconnect", () => {
    console.log("client disconnected", socket.id);
  });
});

httpServer.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
