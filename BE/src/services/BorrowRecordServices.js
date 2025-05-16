import BorrowRecord from "../models/BorrowRecordModel.js";
import BookCopy from "../models/BookCopyModel.js";
import ReservationService from "./ReservationServices.js";
import Fine from "../models/FineModel.js";
import Reservation from "../models/ReservationModel.js";
import TransactionLog from "../models/TransactionLogModel.js";
import Book from "../models/BookModel.js";
import TransactionLogService from "./TransactionLogServices.js";

const BorrowService = {
  // Create borrow record from reservation
  createFromReservation: async (reservationCode) => {
    try {
      const reservation = await ReservationService.getReservationByCode(
        reservationCode
      );

      if (!reservation || reservation.status !== "Approved") {
        throw new Error("Invalid or unapproved reservation");
      }

      const borrowRecord = new BorrowRecord({
        userId: reservation.userId,
        reservationCode: reservation._id,
        books: reservation.books.map((book) => ({
          bookId: book.bookId,
          barcode: book.barcode,
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
        })),
        status: "Active",
      });
      

      // Cập nhật trạng thái BookCopy thành "Borrowed"
      await BorrowService._updateBookStatuses(reservation.books, "Borrowed");

      // Giảm physicalCopies.available và tạo TransactionLog
      await Promise.all(
        reservation.books.map(async (book) => {
          // Giảm số lượng bản sao có sẵn
          // await Book.findByIdAndUpdate(book.bookId, {
          //   $inc: { "physicalCopies.available": -1 },
          // });
          
          // Tạo TransactionLog cho xuất kho
          await TransactionLogService.createTransaction({
            bookId: book.bookId,
            barcode: book.barcode,
            operationType: "Issue",
            quantity: 1,
            operatorId: reservation.userId, // Hoặc có thể lấy từ thông tin người thực hiện (admin)
            note: `Book issued for borrow record from reservation ${reservation._id}`,
          });
        })
      );

      // Cập nhật trạng thái reservation thành "Completed"
      await Reservation.findByIdAndUpdate(reservation._id, {
        status: "Completed",
      });

      // Lưu borrow record
      return await borrowRecord.save();
    } catch (error) {
      console.error("Error in createFromReservation:", error); // Debug log
      throw error;
    }
  },

  // Create direct borrow record
  createDirectBorrow: async (userId, barcodes) => {
    try {
      const books = await BorrowService._validateBarcodes(barcodes);

      const borrowRecord = new BorrowRecord({
        userId,
        books: books.map((book) => ({
          bookId: book.bookId,
          barcode: book.barcode,
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
        })),
        status: "Active",
      });

      await BorrowService._updateBookStatuses(books, "Borrowed");
      return await borrowRecord.save();
    } catch (error) {
      console.error("Error in createDirectBorrow:", error); // Debug log
      throw error;
    }
  },

  // Return books
  returnBooks: async (borrowId, barcodes) => {
    try {
      const borrowRecord = await BorrowRecord.findById(borrowId);
      if (!borrowRecord) throw new Error("Borrow record not found");

      const returnedBooks = borrowRecord.books.filter((book) =>
        barcodes.includes(book.barcode)
      );

      // Update book statuses
      await BorrowService._updateBookStatuses(returnedBooks, "Available");

      // Update borrow record
      const updatedRecord = await BorrowRecord.findByIdAndUpdate(
        borrowId,
        {
          $set: {
            "books.$[elem].status": "Returned",
            "books.$[elem].returnedAt": new Date(),
          },
        },
        {
          arrayFilters: [{ "elem.barcode": { $in: barcodes } }],
          new: true,
        }
      );

      // Update overall status
      await BorrowService._updateOverallStatus(updatedRecord);

      return updatedRecord;
    } catch (error) {
      console.error("Error in returnBooks:", error); // Debug log
      throw error;
    }
  },

  // Update book status (Returned, Overdue, Lost)
  updateBookStatus: async (borrowId, barcode, newStatus, user) => {
    try {
      if (!user || !user.id) {
        throw new Error("User information is missing or invalid");
      }

      const borrowRecord = await BorrowRecord.findById(borrowId);
      if (!borrowRecord) throw new Error("Borrow record not found");

      let targetBooks = barcode
        ? borrowRecord.books.filter((book) => book.barcode === barcode)
        : borrowRecord.books;

      if (targetBooks.length === 0) throw new Error("No matching books found");

      const now = new Date();
      const finesToCreate = [];

      for (const book of targetBooks) {
        // Validate status and role permissions
        if (!["Borrowed", "Returned", "Overdue", "Lost"].includes(newStatus)) {
          throw new Error("Invalid status");
        }
        if (user.role === "librarian" && newStatus !== "Returned") {
          throw new Error("Librarians can only set status to Returned");
        }
        if (user.role !== "admin" && ["Borrowed", "Lost"].includes(newStatus)) {
          throw new Error("Only admins can set status to Borrowed or Lost");
        }

        // Handle status changes
        if (newStatus === "Borrowed") {
          if (book.status === "Borrowed") continue; // No change needed

          // Update BookCopy status
          const bookCopy = await BookCopy.findOne({ barcode: book.barcode });
          if (!bookCopy) throw new Error(`Book copy ${book.barcode} not found`);
          bookCopy.status = "Borrowed";
          await bookCopy.save();

          // Decrement available copies (Xuất kho)
          await Book.findByIdAndUpdate(book.bookId, {
            $inc: { "physicalCopies.available": -1 },
          });

          // Log Xuất kho transaction
          await TransactionLogService.createTransaction({
            bookId: book.bookId,
            barcode: book.barcode,
            operationType: "Issue",
            quantity: 1,
            operatorId: user.id,
            note: `Book issued for borrow record ${borrowId}`,
          });

          // Clear returnedAt
          book.returnedAt = null;

          // Remove associated fines (for Lost or Overdue)
          if (book.status === "Lost" || book.status === "Overdue") {
            await Fine.deleteMany({
              borrowRecordId: borrowId,
              barcode: book.barcode,
              reason: book.status === "Lost" ? "Lost" : "Overdue",
            });
            borrowRecord.fines = borrowRecord.fines.filter(async (fineId) => {
              const fine = await Fine.findById(fineId);
              return fine && fine.barcode !== book.barcode;
            });
          }

          // If reverting from Lost, increment total and available copies
          if (book.status === "Lost") {
            await Book.findByIdAndUpdate(book.bookId, {
              $inc: {
                "physicalCopies.total": 1,
                "physicalCopies.available": 1,
              },
            });
            await TransactionLogService.createTransaction({
              bookId: book.bookId,
              barcode: book.barcode,
              operationType: "Lost",
              quantity: 1,
              operatorId: user.id,
              note: `Reverted Lost to Borrowed for book ${book.barcode} in borrow record ${borrowId}`,
            });
          }
        } else if (newStatus === "Returned") {
          // Update BookCopy status to Available
          const bookCopy = await BookCopy.findOne({ barcode: book.barcode });
          if (!bookCopy) throw new Error(`Book copy ${book.barcode} not found`);
          bookCopy.status = "Available";
          await bookCopy.save();

          // Increment available copies (Nhập kho)
          // await Book.findByIdAndUpdate(book.bookId, {
          //   $inc: { "physicalCopies.available": 1 },
          // });

          // Log Nhập kho transaction
          await TransactionLogService.createTransaction({
            bookId: book.bookId,
            barcode: book.barcode,
            operationType: "Return",
            quantity: 1,
            operatorId: user.id,
            note: `Book returned in borrow record ${borrowId}`,
          });

          book.returnedAt = now;
        } else if (newStatus === "Overdue") {
          if (book.status !== "Borrowed" || new Date(book.dueDate) >= now) {
            throw new Error(`Book ${book.barcode} is not overdue`);
          }
          // Create fine for overdue book
          const daysOverdue = Math.floor(
            (now - new Date(book.dueDate)) / (1000 * 60 * 60 * 24)
          );
          const bookCopy = await BookCopy.findOne({ barcode: book.barcode });
          if (!bookCopy) throw new Error(`Book copy ${book.barcode} not found`);
          finesToCreate.push({
            borrowRecordId: borrowId,
            userId: borrowRecord.userId,
            bookCopyId: bookCopy._id,
            barcode: book.barcode,
            fineAmount: daysOverdue * 5000, // 5k VND per day
            reason: "Overdue",
            daysOverdue,
          });
        } else if (newStatus === "Lost") {
          // Update BookCopy status to Lost
          const bookCopy = await BookCopy.findOne({ barcode: book.barcode });
          if (!bookCopy) throw new Error(`Book copy ${book.barcode} not found`);
          bookCopy.status = "Lost";
          await bookCopy.save();

          // // Decrement total and available copies
          // await Book.findByIdAndUpdate(book.bookId, {
          //   $inc: {
          //     "physicalCopies.total": -1,
          //     "physicalCopies.available": -1,
          //   },
          // });

          // Log Lost transaction
          await TransactionLogService.createTransaction({
            bookId: book.bookId,
            barcode: book.barcode,
            operationType: "Lost",
            quantity: 1,
            operatorId: user.id,
            note: `Book lost in borrow record ${borrowId}`,
          });

          // Create fine for lost book
          finesToCreate.push({
            borrowRecordId: borrowId,
            userId: borrowRecord.userId,
            bookCopyId: bookCopy._id,
            barcode: book.barcode,
            fineAmount: 100000, // Fixed fine for lost book
            reason: "Lost",
          });

          book.returnedAt = now;
        }

        // Update book status in borrow record
        book.status = newStatus;
      }

      // Save fines
      if (finesToCreate.length > 0) {
        const fines = await Fine.create(finesToCreate);
        borrowRecord.fines.push(...fines.map((f) => f._id));
      }

      // Save updated borrow record
      await borrowRecord.save();

      // Update overall status
      await BorrowService._updateOverallStatus(borrowRecord);

      return borrowRecord;
    } catch (error) {
      console.error("Error in updateBookStatus:", error);
      throw error;
    }
  },

  // Private methods
  _validateBarcodes: async (barcodes) => {
    return Promise.all(
      barcodes.map(async (barcode) => {
        const copy = await BookCopy.findOne({ barcode });
        if (!copy || copy.status !== "Available") {
          throw new Error(`Book ${barcode} not available`);
        }
        return {
          bookId: copy.bookId,
          barcode: copy.barcode,
        };
      })
    );
  },

  _updateBookStatuses: async (books, status) => {
    await Promise.all(
      books.map(async (book) => {
        await BookCopy.findOneAndUpdate({ barcode: book.barcode }, { status });
      })
    );
  },

  _updateOverallStatus: async (record) => {
    const bookStatuses = record.books.map((b) => b.status);
    let newStatus = "Active";

    if (bookStatuses.every((status) => status === "Returned")) {
      newStatus = "Completed";
    } else if (
      bookStatuses.some((status) => status === "Returned" || status === "Lost")
    ) {
      newStatus = "PartiallyReturned";
    } else if (bookStatuses.some((status) => status === "Overdue")) {
      newStatus = "PartiallyReturned";
    }

    await BorrowRecord.findByIdAndUpdate(record._id, { status: newStatus });
  },

  // Check and update overdue books, create fines
  checkOverdueBooks: async () => {
    try {
      const now = new Date();
      const borrowRecords = await BorrowRecord.find({
        status: { $in: ["Active", "PartiallyReturned"] },
      });

      for (const record of borrowRecords) {
        let hasUpdates = false;
        const finesToCreate = [];

        for (const book of record.books) {
          if (book.status === "Borrowed" && new Date(book.dueDate) < now) {
            book.status = "Overdue";
            hasUpdates = true;

            const daysOverdue = Math.floor(
              (now - new Date(book.dueDate)) / (1000 * 60 * 60 * 24)
            );
            const bookCopy = await BookCopy.findOne({ barcode: book.barcode });

            finesToCreate.push({
              borrowRecordId: record._id,
              userId: record.userId,
              bookCopyId: bookCopy._id,
              barcode: book.barcode,
              fineAmount: daysOverdue * 5000, // 5k VND per day
              reason: "Overdue",
              daysOverdue,
            });
          }
        }

        if (hasUpdates) {
          await record.save(); // Save updated book statuses
          if (finesToCreate.length > 0) {
            const fines = await Fine.create(finesToCreate);
            record.fines.push(...fines.map((f) => f._id));
            await record.save(); // Save fines to borrow record
          }
          await BorrowService._updateOverallStatus(record); // Update overall status
        }
      }
    } catch (error) {
      console.error("Error in checkOverdueBooks:", error); // Debug log
      throw error;
    }
  },

  addBooksToBorrow: async (borrowId, barcodes) => {
    try {
      const books = await BorrowService._validateBarcodes(barcodes);

      const updatedRecord = await BorrowRecord.findByIdAndUpdate(
        borrowId,
        {
          $push: {
            books: books.map((book) => ({
              bookId: book.bookId,
              barcode: book.barcode,
              dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
              status: "Borrowed",
            })),
          },
        },
        { new: true }
      );

      await BorrowService._updateBookStatuses(books, "Borrowed");
      return updatedRecord;
    } catch (error) {
      console.error("Error in addBooksToBorrow:", error); // Debug log
      throw error;
    }
  },

  getAllRecords: async (filters = {}) => {
    try {
      console.log("getAllRecords with filters:", filters); // Debug log
      return await BorrowRecord.find(filters)
        .populate("userId")
        .populate("books.bookId")
        .populate("fines")
        .sort({ createdAt: -1 });
    } catch (error) {
      console.error("Error in getAllRecords:", error); // Debug log
      throw error;
    }
  },

  getRecordById: async (id) => {
    try {
      const record = await BorrowRecord.findById(id)
        .populate("userId")
        .populate("books.bookId")
        .populate("fines");
      if (!record) throw new Error("Không tìm thấy phiếu mượn");
      return record;
    } catch (error) {
      console.error("Error in getRecordById:", error); // Debug log
      throw error;
    }
  },

  extendDueDate: async (borrowId, barcodes, extraDays) => {
    try {
      const updatedRecord = await BorrowRecord.findByIdAndUpdate(
        borrowId,
        {
          $set: {
            "books.$[elem].dueDate": new Date(
              Date.now() + (14 + extraDays) * 24 * 60 * 60 * 1000
            ),
            "books.$[elem].extended": true,
            "books.$[elem].extensionDays": extraDays,
          },
        },
        {
          arrayFilters: [{ "elem.barcode": { $in: barcodes } }],
          new: true,
        }
      );
      return updatedRecord;
    } catch (error) {
      console.error("Error in extendDueDate:", error); // Debug log
      throw error;
    }
  },

  markAsLost: async (borrowId, barcodes) => {
    try {
      // Update book statuses
      await BookCopy.updateMany(
        { barcode: { $in: barcodes } },
        { status: "Lost" }
      );

      // Update borrow record
      const updatedRecord = await BorrowRecord.findByIdAndUpdate(
        borrowId,
        {
          $set: {
            "books.$[elem].status": "Lost",
            "books.$[elem].returnedAt": new Date(),
          },
        },
        {
          arrayFilters: [{ "elem.barcode": { $in: barcodes } }],
          new: true,
        }
      );

      // Create fines for lost books
      const lostBooks = updatedRecord.books.filter((book) =>
        barcodes.includes(book.barcode)
      );

      const finesToCreate = [];

      for (const book of lostBooks) {
        const bookCopy = await BookCopy.findOne({ barcode: book.barcode });

        if (!bookCopy) {
          throw new Error(
            `Không tìm thấy BookCopy với barcode: ${book.barcode}`
          );
        }

        finesToCreate.push({
          borrowRecordId: updatedRecord._id,
          userId: updatedRecord.userId,
          bookCopyId: bookCopy._id,
          barcode: book.barcode,
          fineAmount: 100000,
          reason: "Lost",
        });
      }

      const fines = await Fine.create(finesToCreate);

      // Add fines to borrow record
      updatedRecord.fines.push(...fines.map((f) => f._id));
      await updatedRecord.save();

      // Create TransactionLog for lost books
      await TransactionLog.create(
        lostBooks.map((book) => ({
          bookId: book.bookId,
          barcode: book.barcode,
          operationType: "Lost",
          quantity: 1,
          operatorId: updatedRecord.userId, // Assuming userId as operator for simplicity
          note: `Book lost in borrow record ${updatedRecord._id}`,
          createdAt: new Date(),
        }))
      );

      // Update overall status
      await BorrowService._updateOverallStatus(updatedRecord);

      return updatedRecord;
    } catch (error) {
      console.error("Error in markAsLost:", error); // Debug log
      throw error;
    }
  },

  calculateOverdueFines: async (borrowId) => {
    try {
      const record = await BorrowService.getRecordById(borrowId);

      const overdueBooks = record.books.filter(
        (book) =>
          new Date(book.dueDate) < new Date() && book.status === "Borrowed"
      );

      // Delete old overdue fines
      await Fine.deleteMany({
        borrowRecordId: borrowId,
        reason: "Overdue",
      });

      // Calculate new fines (5k/day)
      const fines = await Fine.create(
        overdueBooks.map((book) => {
          const daysOverdue = Math.floor(
            (new Date() - new Date(book.dueDate)) / (1000 * 60 * 60 * 24)
          );
          return {
            borrowRecordId: borrowId,
            userId: record.userId,
            bookCopyId: BookCopy.findOne({ barcode: book.barcode })._id,
            barcode: barcode,
            fineAmount: daysOverdue * 5000,
            reason: "Overdue",
            daysOverdue,
          };
        })
      );

      // Update borrow record with new fines
      record.fines.push(...fines.map((f) => f._id));
      await record.save();

      return record;
    } catch (error) {
      console.error("Error in calculateOverdueFines:", error); // Debug log
      throw error;
    }
  },

  getStatistics: async () => {
    try {
      const [total, active, overdue] = await Promise.all([
        BorrowRecord.countDocuments(),
        BorrowRecord.countDocuments({ status: "Active" }),
        BorrowRecord.countDocuments({
          "books.dueDate": { $lt: new Date() },
          "books.status": "Borrowed",
        }),
      ]);

      return { total, active, overdue };
    } catch (error) {
      console.error("Error in getStatistics:", error); // Debug log
      throw error;
    }
  },

  processScannedCodes: async ({ codes, userId }) => {
    try {
      const reservationCodes = codes.filter((code) =>
        /^[A-Z0-9]{8}$/.test(code)
      );
      const bookBarcodes = codes.filter((code) => !/^[A-Z0-9]{8}$/.test(code));

      if (reservationCodes.length > 1) {
        throw new Error("Chỉ xử lý 1 đặt chỗ mỗi lần");
      }

      let record;
      if (reservationCodes.length === 1) {
        record = await BorrowService.createFromReservation(reservationCodes[0]);
        if (bookBarcodes.length > 0) {
          record = await BorrowService.addBooksToBorrow(
            record._id,
            bookBarcodes
          );
        }
      } else if (bookBarcodes.length > 0) {
        record = await BorrowService.createDirectBorrow(userId, bookBarcodes);
      } else {
        throw new Error("Không có mã hợp lệ");
      }

      return record;
    } catch (error) {
      console.error("Error in processScannedCodes:", error); // Debug log
      throw error;
    }
  },
};

export default BorrowService;
