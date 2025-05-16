import mongoose from "mongoose";

const borrowStatusHistorySchema = new mongoose.Schema({
  borrowId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BorrowRecord",
    required: true,
  },
  barcode: {
    type: String,
    required: true,
  },
  oldStatus: {
    type: String,
    enum: ["Borrowed", "Returned", "Overdue", "Lost"],
    required: true,
  },
  newStatus: {
    type: String,
    enum: ["Borrowed", "Returned", "Overdue", "Lost"],
    required: true,
  },
  changedAt: {
    type: Date,
    default: Date.now,
  },
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model("BorrowStatusHistory", borrowStatusHistorySchema);