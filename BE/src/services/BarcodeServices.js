import Reservation from "../models/ReservationModel.js";
import BookCopy from "../models/BookCopyModel.js";
import Book from "../models/BookModel.js";

const BarcodeService = {
  // Scan any QR/barcode and return its type and data
  scanCode: async (code) => {
    try {
      // Check if it's a reservation code (format: 8 alphanumeric chars)
      if (/^[A-Z0-9]{8}$/.test(code)) {
        const reservation = await Reservation.findOne({ reservationCode: code })
          .populate('userId')
          .populate('books.bookId');
        
        if (!reservation) throw new Error('Invalid reservation code');
        
        return {
          type: 'reservation',
          data: reservation
        };
      }
      
      // Otherwise treat as book barcode
      const bookCopy = await BookCopy.findOne({ barcode: code })
        .populate('bookId');
      
      if (!bookCopy) throw new Error('Invalid book barcode');
      
      const book = await Book.findById(bookCopy.bookId)
        .populate('categoryId')
        .populate('facultyId');
      
      return {
        type: 'book',
        data: {
          copy: bookCopy,
          bookInfo: {
            title: book.title,
            author: book.author,
            ISBN: book.ISBN,
            category: book.categoryId?.name,
            faculty: book.facultyId?.name,
            publishedYear: book.publishedYear,
            coverImage: book.coverImage
          }
        }
      };
    } catch (error) {
      throw error;
    }
  },

  // Generate QR code data for a reservation
  generateReservationQRData: async (reservationCode) => {
    const reservation = await Reservation.findOne({ reservationCode })
      .populate('userId')
      .populate('books.bookId');
    
    if (!reservation) throw new Error('Reservation not found');
    
    return {
      type: 'reservation',
      code: reservation.reservationCode,
      user: {
        id: reservation.userId._id,
        name: reservation.userId.name
      },
      books: reservation.books.map(book => ({
        bookId: book.bookId._id,
        title: book.bookId.title,
        barcode: book.barcode
      })),
      status: reservation.status,
      requestDate: reservation.requestDate
    };
  }
};

export default BarcodeService;