import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = 3008|| 5000;

app.get("/", (req, res) => {
  res.send("Hello everyone!");
});

app.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});
