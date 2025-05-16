import mongoose from "mongoose";

const transactionLogSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  barcode: { type: String }, // QR code của bản copy
  operationType: {
    type: String,
    enum: ["Import", "Export", "Issue", "Return", "Lost"],
    required: true,
  },
  quantity: { type: Number, default: 1 }, // Số lượng (thường là 1 với sách vật lý)
  operatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Người thực hiện
  note: { type: String }, // Ghi chú (ví dụ: lý do xuất/hư hỏng)
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("TransactionLog", transactionLogSchema);
