import express from "express";
import bookCopyController from "../controllers/BookCopyControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/getAll", bookCopyController.getAllBookCopies);
router.get("/:id", bookCopyController.getCopiesByBook);
router.patch(
  "/update/:id",
  authMiddleware.isLibrarianMiddleware,
  bookCopyController.updateBookCopy
);

export default router;
