import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import colors from "colors";
import authRouter from "./routes/authRoutes.js";

const app = express();

const port = process.env.port || 4000;

connectDB();

app.use(cookieParser());

app.use(express.json());

app.use(cors({ credentials: true }));

app.use("/api/auth", authRouter);

app.listen(port, () =>
  console.log(`\nServer Started on port ${port}\n`.green.underline)
);
