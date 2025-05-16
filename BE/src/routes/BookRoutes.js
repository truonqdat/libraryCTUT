import express from "express";
import BookController from "../controllers/BookControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploads.js"; // Import Multer config

const router = express.Router();

// Create book with eBook file and cover image
router.post(
  "/create",
  authMiddleware.isLibrarianMiddleware,
  upload.fields([
    { name: "ebook", maxCount: 1 }, // Optional eBook file
    { name: "cover", maxCount: 1 }, // Required cover image
  ]),
  BookController.createBook
);

router.put(
  "/update/:id",
  authMiddleware.isLibrarianMiddleware,
  upload.fields([
    { name: "ebook", maxCount: 1 }, // Optional eBook file
    { name: "cover", maxCount: 1 }, // Required cover image
  ]),
  BookController.updateBook
);

// Other routes
router.get("/getAll", BookController.getAllBooks);
router.get("/:id", BookController.getBook);
router.get("/:id/copies", BookController.getBookCopies);


// Add additional eBook file to existing book
router.patch(
  "/:id/digital-assets",
  authMiddleware.isLibrarianMiddleware,
  upload.single("ebook"),
  BookController.addDigitalAsset
);

router.post("/:id/download", BookController.downloadEbook);

router.get("/by-faculty/:id", BookController.getBooksByFaculty);
router.get("/by-category/:id", BookController.getBooksByCategory);

export default router;