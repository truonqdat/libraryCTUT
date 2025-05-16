import Reservation from "../models/ReservationModel.js";
import BookCopy from "../models/BookCopyModel.js";
import Book from "../models/BookModel.js";
import User from "../models/UserModel.js";
import { nanoid } from "nanoid";
import mongoose from "mongoose";

const MAX_BOOKS_PER_USER = 3;
const MAX_PENDING_RESERVATIONS = 1;

const ReservationStatus = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const BookCopyStatus = {
  AVAILABLE: "Available",
  PENDING: "Pending",
  BORROWED: "Borrowed",
  RESERVED: "Reserved",
  LOST: "Lost",
};

const ReservationService = {
  /**
   * Tạo yêu cầu mượn sách mới
   * @param {string} userId - ID người dùng
   * @param {Array} books - Danh sách sách muốn mượn
   * @returns {Promise} - Promise trả về reservation đã tạo
   */
  createReservation: async (userId, books) => {
    // Validate input
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("ID người dùng không hợp lệ");
    }

    if (!books || !Array.isArray(books) || books.length === 0) {
      throw new Error("Vui lòng chọn ít nhất 1 cuốn sách");
    }

    if (books.length > MAX_BOOKS_PER_USER) {
      throw new Error(
        `Mỗi tài khoản chỉ được mượn tối đa ${MAX_BOOKS_PER_USER} cuốn sách`
      );
    }

    // Kiểm tra user có tồn tại không
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }

    // Kiểm tra user có yêu cầu đang chờ nào không
    const pendingCount = await Reservation.countDocuments({
      userId,
      status: ReservationStatus.PENDING,
    });

    if (pendingCount >= MAX_PENDING_RESERVATIONS) {
      throw new Error("Bạn đã có yêu cầu mượn sách đang chờ duyệt");
    }

    // Validate từng cuốn sách
    const validatedBooks = [];
    const bookBarcodes = new Set();

    for (const book of books) {
      // Kiểm tra trùng lặp trong cùng 1 yêu cầu
      if (bookBarcodes.has(book.barcode)) {
        throw new Error(
          `Không thể mượn nhiều bản copy của cùng 1 cuốn sách (${book.barcode})`
        );
      }
      bookBarcodes.add(book.barcode);

      // Kiểm tra sách có tồn tại và khả dụng không
      const bookCopy = await BookCopy.findOne({
        barcode: book.barcode,
      }).populate("bookId");

      if (!bookCopy) {
        throw new Error(`Không tìm thấy sách với mã vạch ${book.barcode}`);
      }

      if (bookCopy.status !== BookCopyStatus.AVAILABLE) {
        throw new Error(
          `Sách "${bookCopy.bookId?.title || book.barcode}" hiện không khả dụng (trạng thái: ${bookCopy.status})`
        );
      }

      // Kiểm tra user đã mượn sách này chưa
      const existingLoan = await Reservation.findOne({
        userId,
        "books.barcode": book.barcode,
        status: { $in: [ReservationStatus.PENDING, ReservationStatus.APPROVED] },
      });

      if (existingLoan) {
        throw new Error(
          `Bạn đã mượn sách "${bookCopy.bookId?.title || book.barcode}" (${book.barcode})`
        );
      }

      validatedBooks.push({
        bookId: bookCopy.bookId._id,
        barcode: book.barcode,
        title: bookCopy.bookId?.title || "Không có tiêu đề",
      });
    }

    // Chuyển trạng thái sách sang Pending
    await Promise.all(
      validatedBooks.map((book) =>
        BookCopy.findOneAndUpdate(
          { barcode: book.barcode },
          { status: BookCopyStatus.PENDING }
        )
      )
    );

    // Tạo reservation mới
    const reservation = new Reservation({
      userId,
      books: validatedBooks,
      reservationCode: nanoid(8).toUpperCase(),
      status: ReservationStatus.PENDING,
      requestDate: new Date(),
    });

    return await reservation.save();
  },

  /**
   * Duyệt yêu cầu mượn sách
   * @param {string} reservationId - ID reservation
   * @param {string} approvedBy - ID người duyệt
   * @returns {Promise} - Promise trả về reservation đã duyệt
   */
  approveReservation: async (reservationId, approvedBy) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const reservation = await Reservation.findById(reservationId).session(
        session
      );
      if (!reservation) {
        throw new Error("Không tìm thấy yêu cầu mượn sách");
      }

      if (reservation.status !== ReservationStatus.PENDING) {
        throw new Error("Chỉ có thể duyệt yêu cầu đang chờ xử lý");
      }

      // Kiểm tra lại trạng thái sách và số lượng có sẵn
      for (const book of reservation.books) {
        const bookCopy = await BookCopy.findOne({
          barcode: book.barcode,
        }).session(session);
        if (!bookCopy || bookCopy.status !== BookCopyStatus.PENDING) {
          throw new Error(
            `Sách "${book.title}" (${book.barcode}) không còn khả dụng để mượn`
          );
        }

        // Kiểm tra số lượng có sẵn trong BookModel
        const bookDoc = await Book.findById(bookCopy.bookId).session(session);
        if (!bookDoc || bookDoc.physicalCopies.available <= 0) {
          throw new Error(
            `Sách "${book.title}" không còn bản sao vật lý nào khả dụng`
          );
        }
      }

      // Cập nhật trạng thái sách sang Borrowed và giảm physicalCopies.available
      await Promise.all(
        reservation.books.map(async (book) => {
          const bookCopy = await BookCopy.findOne({
            barcode: book.barcode,
          }).session(session);
          // Cập nhật trạng thái bản sao
          await BookCopy.findOneAndUpdate(
            { barcode: book.barcode },
            { status: BookCopyStatus.BORROWED },
            { session }
          );
          // // Giảm physicalCopies.available trong BookModel
          // await Book.findByIdAndUpdate(
          //   bookCopy.bookId,
          //   {
          //     $inc: { "physicalCopies.available": -1 },
          //   },
          //   { session }
          // );
        })
      );

      // Cập nhật reservation
      reservation.status = ReservationStatus.APPROVED;
      reservation.approvedAt = new Date();
      reservation.approvedBy = approvedBy;

      await reservation.save({ session });
      await session.commitTransaction();
      return reservation;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },

  /**
   * Từ chối yêu cầu mượn sách
   * @param {string} reservationId - ID reservation
   * @param {string} rejectedBy - ID người từ chối
   * @param {string} reason - Lý do từ chối
   * @returns {Promise} - Promise trả về reservation đã từ chối
   */
  rejectReservation: async (reservationId, rejectedBy, reason) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const reservation = await Reservation.findById(reservationId).session(
        session
      );
      if (!reservation) {
        throw new Error("Không tìm thấy yêu cầu mượn sách");
      }

      if (reservation.status !== ReservationStatus.PENDING) {
        throw new Error("Chỉ có thể từ chối yêu cầu đang chờ xử lý");
      }

      // Chuyển trạng thái sách về Available
      await Promise.all(
        reservation.books.map((book) =>
          BookCopy.findOneAndUpdate(
            { barcode: book.barcode },
            { status: BookCopyStatus.AVAILABLE },
            { session }
          )
        )
      );

      // Cập nhật reservation
      reservation.status = ReservationStatus.REJECTED;
      reservation.rejectedAt = new Date();
      reservation.rejectedBy = rejectedBy;
      reservation.rejectionReason = reason;

      await reservation.save({ session });
      await session.commitTransaction();
      return reservation;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },

  /**
   * Hoàn thành đặt mượn (khi trả sách)
   * @param {string} reservationId - ID reservation
   * @param {string} completedBy - ID người xử lý
   * @returns {Promise} - Promise trả về reservation đã hoàn thành
   */
  completeReservation: async (reservationId, completedBy) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const reservation = await Reservation.findById(reservationId).session(
        session
      );
      if (!reservation) {
        throw new Error("Không tìm thấy yêu cầu mượn sách");
      }

      if (reservation.status !== ReservationStatus.APPROVED) {
        throw new Error("Chỉ có thể hoàn thành yêu cầu đã được duyệt");
      }

      // Chuyển trạng thái sách về Available và tăng physicalCopies.available
      await Promise.all(
        reservation.books.map(async (book) => {
          const bookCopy = await BookCopy.findOne({
            barcode: book.barcode,
          }).session(session);
          // Cập nhật trạng thái bản sao
          await BookCopy.findOneAndUpdate(
            { barcode: book.barcode },
            { status: BookCopyStatus.AVAILABLE },
            { session }
          );
          // Tăng physicalCopies.available trong BookModel
          await Book.findByIdAndUpdate(
            bookCopy.bookId,
            {
              $inc: { "physicalCopies.available": 1 },
            },
            { session }
          );
        })
      );

      // Cập nhật reservation
      reservation.status = ReservationStatus.COMPLETED;
      reservation.completedAt = new Date();
      reservation.completedBy = completedBy;

      await reservation.save({ session });
      await session.commitTransaction();
      return reservation;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },

  /**
   * Hủy yêu cầu mượn sách (bởi người dùng)
   * @param {string} reservationId - ID reservation
   * @param {string} userId - ID người hủy
   * @returns {Promise} - Promise trả về reservation đã hủy
   */
  cancelReservation: async (reservationId, userId) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const reservation = await Reservation.findById(reservationId).session(
        session
      );
      if (!reservation) {
        throw new Error("Không tìm thấy yêu cầu mượn sách");
      }

      if (reservation.userId.toString() !== userId.toString()) {
        throw new Error("Bạn chỉ có thể hủy yêu cầu của chính mình");
      }

      if (reservation.status !== ReservationStatus.PENDING) {
        throw new Error("Chỉ có thể hủy yêu cầu đang chờ xử lý");
      }

      // Chuyển trạng thái sách về Available
      await Promise.all(
        reservation.books.map((book) =>
          BookCopy.findOneAndUpdate(
            { barcode: book.barcode },
            { status: BookCopyStatus.AVAILABLE },
            { session }
          )
        )
      );

      // Cập nhật reservation
      reservation.status = ReservationStatus.CANCELLED;
      reservation.cancelledAt = new Date();
      reservation.cancelledBy = userId;

      await reservation.save({ session });
      await session.commitTransaction();
      return reservation;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },

  // Các phương thức truy vấn khác giữ nguyên...
  getReservationById: async (reservationId) => {
    return await Reservation.findById(reservationId)
      .populate("userId")
      .populate("approvedBy")
      .populate("rejectedBy")
      .populate("books.bookId");
  },

  getReservationByCode: async (code) => {
    return await Reservation.findOne({ reservationCode: code })
      .populate("userId")
      .populate("books.bookId");
  },

  getUserReservations: async (userId, status) => {
    const query = { userId };
    if (status) query.status = status;

    return await Reservation.find(query)
      .populate("books.bookId")
      .sort({ requestDate: -1 });
  },

  getAllReservations: async (filters = {}) => {
    const query = {};

    if (filters.status) query.status = filters.status;
    if (filters.userId) query.userId = filters.userId;
    if (filters.dateFrom || filters.dateTo) {
      query.requestDate = {};
      if (filters.dateFrom) query.requestDate.$gte = new Date(filters.dateFrom);
      if (filters.dateTo) query.requestDate.$lte = new Date(filters.dateTo);
    }

    return await Reservation.find(query)
      .populate("userId")
      .populate("books.bookId")
      .sort({ requestDate: -1 });
  },
};

export default ReservationService;