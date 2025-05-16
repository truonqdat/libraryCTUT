import BookService from "../services/BookServices.js";
import path from "path";

const BookController = {
  createBook: async (req, res) => {
    try {
      const bookData = req.body;
      if (typeof bookData.formats === "string") {
        bookData.formats = JSON.parse(bookData.formats);
      }
      const book = await BookService.createBook(bookData, req.files);
      res.status(201).json(book);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  updateBook: async (req, res) => {
    try {
      const { id } = req.params;
      const bookData = req.body;
      const files = req.files;

      if (bookData.formats && typeof bookData.formats === "string") {
        try {
          bookData.formats = JSON.parse(bookData.formats);
          if (
            !Array.isArray(bookData.formats) ||
            bookData.formats.length === 0
          ) {
            throw new Error("Formats must be a non-empty array");
          }
        } catch (error) {
          throw new Error(
            "Invalid formats format. Must be a valid JSON array."
          );
        }
      } else if (bookData.formats && !Array.isArray(bookData.formats)) {
        throw new Error("Formats must be an array");
      }

      console.log("Parsed bookData:", bookData);

      const updatedBook = await BookService.updateBook(id, bookData, files);

      res.status(200).json({
        success: true,
        message: "Book updated successfully",
        data: updatedBook,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  addDigitalAsset: async (req, res) => {
    try {
      const { id } = req.params;
      const book = await BookService.addDigitalAsset(id, req.file);
      res.status(200).json(book);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getAllBooks: async (req, res) => {
    try {
      const books = await BookService.getAllBooks(req.query);
      res.status(200).json(books);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getBook: async (req, res) => {
    try {
      const book = await BookService.getBookById(req.params.id);
      if (!book) return res.status(404).json({ message: "Book not found" });
      res.status(200).json(book);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  downloadEbook: async (req, res) => {
    try {
      const { id } = req.params;
      const { fileType } = req.body;
      const book = await BookService.getBookById(id);
      if (!book || !book.digitalAssets.length) {
        return res.status(404).json({ message: "No digital assets found" });
      }
      const asset = book.digitalAssets.find((a) => a.fileType === fileType);
      if (!asset) {
        return res.status(404).json({ message: "File type not found" });
      }
      await BookService.incrementDownloadCount(id, fileType);
      const filePath = path.join(process.cwd(), "public", asset.filePath);
      const fileName = path.basename(asset.filePath);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );
      res.download(filePath, fileName);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getBookCopies: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.query;
      const query = { bookId: id };
      if (status) query.status = status;
      const copies = await BookService.getBookCopies(id, query);
      res.status(200).json(copies);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getBooksByFaculty: async (req, res) => {
    try {
      const books = await BookService.getBooksByFaculty(req.params.id);

      if (books.length > 0) {
        res.json(books);
      } else {
        res.status(404).json({ error: "No books found for this faculty" });
      }
    } catch (error) {
      res.status(500).json({ error: "Database query error" });
    }
  },

  getBooksByCategory: async (req, res) => {
    try {
      const { id: categoryId } = req.params;

      const books = await BookService.getBooksByCategory(categoryId);

      if (books.length > 0) {
        res.json(books);
      } else {
        res.status(404).json({ error: "No books found for this category" });
      }
    } catch (error) {
      console.error("Error getting books by category:", error);
      res.status(500).json({ error: "Database query error" });
    }
  },
};

export default BookController;
