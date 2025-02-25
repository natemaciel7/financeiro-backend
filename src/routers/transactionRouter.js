import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  addTransaction,
  getTransactions,
} from "../controllers/transactionController.js";

const router = express.Router();

router.use(authMiddleware);
router.post("/", addTransaction);
router.get("/", getTransactions);

export default router;
