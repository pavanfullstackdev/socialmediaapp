import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

//accept data from user in json
app.use(express.json({ limit: "16kb" }));

// url encoder data acceptance
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

//file or folder storage
app.use(express.static("public"));

//use cookies
app.use(cookieParser());

//routes Import
import userRouter from "./routes/user.routes.js";

//routes declaration
app.use("/api/v1/users", userRouter);

export { app };
