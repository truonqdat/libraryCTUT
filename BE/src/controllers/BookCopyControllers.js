import BookCopyService from "../services/BookCopyServices.js";

const BookCopyController = {

  // Get all book copies
  getAllBookCopies: async (req, res) => {
    try {
      const bookCopies = await BookCopyService.getAllBookCopies(req.query);
      res.status(200).json(bookCopies);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get a single book copy
  getBookCopy: async (req, res) => {
    try {
      const bookCopy = await BookCopyService.getBookCopyById(req.params.id);
      if (!bookCopy) {
        return res.status(404).json({ message: 'Book copy not found' });
      }
      res.status(200).json(bookCopy);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get copies by book ID
  getCopiesByBook: async (req, res) => {
    try {
      const copies = await BookCopyService.getCopiesByBookId(req.params.bookId);
      res.status(200).json(copies);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update a book copy
  updateBookCopy: async (req, res) => {
    try {
      const updatedCopy = await BookCopyService.updateBookCopy(req.params.id, req.body);
      if (!updatedCopy) {
        return res.status(404).json({ message: "Book copy not found" });
      }
      res.status(200).json(updatedCopy);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete a book copy
  deleteBookCopy: async (req, res) => {
    try {
      const deletedCopy = await BookCopyService.deleteBookCopy(req.params.id);
      if (!deletedCopy) {
        return res.status(404).json({ message: 'Book copy not found' });
      }
      res.status(200).json({ message: 'Book copy deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get copies by status
  getCopiesByStatus: async (req, res) => {
    try {
      const copies = await BookCopyService.getCopiesByStatus(req.params.status);
      res.status(200).json(copies);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update copy status
  updateStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const updatedCopy = await BookCopyService.updateCopyStatus(req.params.id, status);
      res.status(200).json(updatedCopy);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

export default BookCopyController;