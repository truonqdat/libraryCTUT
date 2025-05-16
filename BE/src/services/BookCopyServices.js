import BookCopy from "../models/BookCopyModel.js";
import BookService from "./BookServices.js";

const BookCopyService = {
  // Create a new book copy
  createBookCopy: async (bookCopyData) => {
    try {
      // Verify the referenced book exists
      const book = await BookService.getBookById(bookCopyData.bookId);
      if (!book) {
        throw new Error("Referenced book not found");
      }

      const newBookCopy = new BookCopy(bookCopyData);
      const savedCopy = await newBookCopy.save();

      // Update the book's copy counts
      await BookService.updateBook(bookCopyData.bookId, {
        $inc: {
          totalCopies: 1,
          availableCopies: bookCopyData.status === "Available" ? 1 : 0,
        },
      });

      return savedCopy;
    } catch (error) {
      throw error;
    }
  },

  // Get all book copies
  getAllBookCopies: async (query = {}) => {
    try {
      return await BookCopy.find(query)
        .populate("bookId")
        .populate("importRecordId");
    } catch (error) {
      throw error;
    }
  },

  // Get book copy by ID
  getBookCopyById: async (id) => {
    try {
      return await BookCopy.findById(id)
        .populate("bookId")
        .populate("importRecordId");
    } catch (error) {
      throw error;
    }
  },

  // Get copies by book ID
  getCopiesByBookId: async (bookId) => {
    try {
      return await BookCopy.find({ bookId }).populate("importRecordId");
    } catch (error) {
      throw error;
    }
  },

  // Update book copy
  updateBookCopy: async (id, updateData) => {
    try {
      const bookCopy = await BookCopy.findById(id);
      if (!bookCopy) {
        throw new Error("Book copy not found");
      }

      // Extract only condition and location from updateData
      const { condition, location } = updateData;

      // Validate inputs
      if (!condition && location === undefined) {
        throw new Error(
          "At least one field (condition or location) must be provided"
        );
      }

      const updateFields = {};

      if (condition) {
        if (!["New", "Good", "Damaged"].includes(condition)) {
          throw new Error(
            "Invalid condition value. Must be New, Good, or Damaged"
          );
        }
        updateFields.condition = condition;
      }

      if (location !== undefined) {
        if (typeof location !== "string") {
          throw new Error("Location must be a string");
        }
        const trimmedLocation = location.trim();
        if (!trimmedLocation) {
          throw new Error("Location cannot be empty");
        }
        updateFields.location = trimmedLocation;
      }

      // Update the book copy
      const updatedCopy = await BookCopy.findByIdAndUpdate(
        id,
        { $set: updateFields },
        { new: true, runValidators: true }
      );

      return updatedCopy;
    } catch (error) {
      throw error;
    }
  },

  // Delete book copy
  deleteBookCopy: async (id) => {
    try {
      const copyToDelete = await BookCopy.findById(id);
      if (!copyToDelete) throw new Error("Book copy not found");

      const result = await BookCopy.findByIdAndDelete(id);

      // Update the book's copy counts
      await BookService.updateBook(copyToDelete.bookId, {
        $inc: {
          totalCopies: -1,
          availableCopies: copyToDelete.status === "Available" ? -1 : 0,
        },
      });

      return result;
    } catch (error) {
      throw error;
    }
  },

  // Get copies by status
  getCopiesByStatus: async (status) => {
    try {
      return await BookCopy.find({ status }).populate("bookId");
    } catch (error) {
      throw error;
    }
  },

  // Update copy status
  updateCopyStatus: async (id, newStatus) => {
    try {
      return await BookCopyService.updateBookCopy(id, { status: newStatus });
    } catch (error) {
      throw error;
    }
  },
};

export default BookCopyService;
