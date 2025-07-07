import express from "express";
import "dotenv/config";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import userRouter from "./router/routes.js";
import http from "http";
import { Server } from "socket.io"; 
import messageRouter from "./router/messageRoute.js";

// create express app and HTTP server
const app = express();
const server = http.createServer(app)
// meddileware setup
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// initialize soket.io server
export const io = new Server(server, {
  cors: { origin: "*" },
});
// store online user
export const userSocketMap = {};
// socket.io connaction handeler

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("user connaction ", userId);

  if (userId) userSocketMap[userId] = socket.id;

  // emit online user to all connaction clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.on("disconnect", () => {
    console.log("user disconnect", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

app.use("/state", (req, res) => res.send("server is live"));
app.use("/user/auth", userRouter);
app.use("/api/message", messageRouter);

await connectDB();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log("server site is runnign on PORT", +PORT));
