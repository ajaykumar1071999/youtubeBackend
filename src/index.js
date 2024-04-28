import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
dotenv.config({ path: "./env" });
const app = express();
connectDB();
app.get("/", (req, res) => {
  res.send("Hello everyone!");
});

app.listen(process.env.PORT, () => {
  console.log(`The server is running on port ${process.env.PORT ?? port}`);
});
