import express from "express";
import TransactionLogController from "../controllers/TransactionLogControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/create",
  authMiddleware.isAdminMiddleware,
  TransactionLogController.createTransaction
);
router.get("/getAll", TransactionLogController.getTransactions);
router.get("/:bookId", (req, res) => {
  req.query.bookId = req.params.bookId;
  return TransactionLogController.getTransactions(req, res);
});

export default router;
