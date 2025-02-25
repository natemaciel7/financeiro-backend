import express from "express";
import dotenv from "dotenv";
import authRouter from "./routers/authRouter.js";
import transactionRouter from "./routers/transactionRouter.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/auth", authRouter);
app.use("/transactions", transactionRouter);

export default app;
