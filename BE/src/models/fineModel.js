import mongoose from "mongoose";

const fineSchema = new mongoose.Schema({
  borrowRecordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BorrowRecord",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bookCopyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BookCopy",
    required: true,
  },
  barcode: { type: String, required: true }, // QR code sách
  fineAmount: { type: Number, required: true }, // Số tiền phạt
  reason: {
    type: String,
    enum: ["Overdue", "Damaged", "Lost"],
    required: true,
  },
  daysOverdue: { type: Number }, // Số ngày quá hạn (nếu là phạt quá hạn)
  status: {
    type: String,
    enum: ["Pending", "Paid", "Waived"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
  paidAt: { type: Date }, // Ngày thanh toán
});

export default mongoose.model("Fine", fineSchema);
