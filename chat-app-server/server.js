import express from "express";
import "dotenv/config";
import cors from "cors";
import http, { Server } from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./router/routes.js";

import { server } from "socket.io";

// create express app and HTTP server
const app = express();
const server = http.createServer(app);

// meddileware setup
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// initialize soket.io server
export const io = new Server(server, {
  cors: { origin: "*" },
});
// store online user
export const userSoketMap = {};

// socket.io connaction handeler

io.on("connaction", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("user connaction ", userId);

  if (userId) userSoketMap[userId] = socket.id;

  // emit online user to all connaction clients
  io.emit("getOnlineUsers", Object.keys(userSoketMap));
  socket.on("disconnect", () => {
    console.log("user disconnect", userId);
    delete userSoketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSoketMap));
  });
});

app.use("/", (req, res) => res.send("server is live"));
app.use("/user/auth", userRouter);

await connectDB();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log("server site is runnign on PORT", +PORT));
