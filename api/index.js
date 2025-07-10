import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.router.js";
import authRouter from "./routes/auth.route.js";
import cors from "cors";
dotenv.config();
const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ["https://w4qcgx-5173.csb.app", "https://c4hyg9-5173.csb.app"],
  })
);
const port = 5000;
app.listen(port, () => {
  console.log("Website served on http://localhost:" + port);
});
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to Mongo DB");
  })
  .catch((err) => {
    console.log(err);
  });

//api routes
// app.get('/test', (req, res) => {
//   //res.send('test hello world')
//   res.json({
//     message: "Test json",
//   })
// })
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

//middleware for comprehensive error process
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error!!";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
