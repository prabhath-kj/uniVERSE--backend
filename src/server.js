import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import mongoose from "mongoose";
import connectDb from "./config/db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import post from "./routes/post.js";
import admin from "./routes/admin.js";

dotenv.config();
connectDb();

const app = express();

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(morgan("short"));
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use(
  cors({
    origin:process.env.ORIGIN,
    methods:["GET","POST","PUT","PATCH"]
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", post);

//admin
app.use("/api/admin", admin);

mongoose.connection.once("open", () => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});
