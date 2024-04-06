import express from "express";
import dotenv from "dotenv";
import { connectMongoDB } from "./db/mongo";
import transactionsRouter from "./routes/transaction.route";
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

connectMongoDB();

app.use("/transactions", transactionsRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
