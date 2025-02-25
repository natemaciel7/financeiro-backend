import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  addTransaction,
  getTransactions,
  deleteTransaction,
} from "../controllers/transactionController.js";

const router = express.Router();

router.use(authMiddleware);
router.post("/", addTransaction);
router.get("/", getTransactions);
router.delete("/:id", deleteTransaction);

export default router;
