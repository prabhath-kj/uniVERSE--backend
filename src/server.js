import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import connectDb from "./config/db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import post from "./routes/post.js";
import admin from "./routes/admin.js";
import notification from "./routes/notifications.js";
import comment from "./routes/comments.js";
import conversation from "./routes/conversation.js";
import message from "./routes/message.js";
import { addUser, removeUser, getUser } from "./utils/socketServer.js";

dotenv.config();
connectDb();

const app = express();
const server = http.createServer(app);

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(morgan("short"));
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH"],
  })
);
const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN,
  },
});

io.on("connection", (socket) => {
  socket.on("add:user", (data) => {
    const { userId } = data;
    const user = addUser(userId, socket.id);
    io.emit("get:users", user);
  });

  socket.on("send:message", (data) => {
    const { receiverId } = data;
    const user = getUser(receiverId);
    io.to(user?.socketId).emit("receive:message", data);
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    const user = removeUser(socket.id);
    io.emit("get:users", user);
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", post);
app.use("/api/notification", notification);
app.use("/api/comments", comment);
app.use("/api/conversations", conversation);
app.use("/api/messages", message);

//admin
app.use("/api/admin", admin);

mongoose.connection.once("open", () => {
  server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});
