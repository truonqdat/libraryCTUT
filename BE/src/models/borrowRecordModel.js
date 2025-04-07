import mongoose from "mongoose";

const borrowRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reservationCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reservation",
  },
  books: [
    {
      bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true,
      },
      barcode: { type: String, required: true }, // QR code từng bản copy
      borrowedAt: { type: Date, default: Date.now }, // Thời điểm mượn
      dueDate: { type: Date, required: true }, // Hạn trả
      returnedAt: { type: Date }, // Ngày trả thực tế
      status: {
        type: String,
        enum: ["Borrowed", "Returned", "Overdue", "Lost"],
        default: "Borrowed",
      },
    },
  ],
  // Trạng thái tổng của phiếu mượn (tùy chọn)
  status: {
    type: String,
    enum: ["Active", "Completed", "PartiallyReturned"],
    default: "Active",
  },
  fines: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fine",
    },
  ],
});

export default mongoose.model("BorrowRecord", borrowRecordSchema);
