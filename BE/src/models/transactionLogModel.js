import mongoose from "mongoose";

const transactionLogSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  action: { type: String, enum: ["Import", "Export"], required: true },
  quantity: { type: Number, required: true },
  librarianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("TransactionLog", transactionLogSchema);
