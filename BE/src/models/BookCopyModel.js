import mongoose from "mongoose";

const bookCopySchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  barcode: { type: String, unique: true, required: true }, // QR code
  status: {
    type: String,
    enum: ["Available", "Borrowed", "Reserved", "Damaged", "Lost"],
    default: "Available",
  },
  location: { type: String }, // Vị trí kệ sách
  importRecordId: { type: mongoose.Schema.Types.ObjectId, ref: "TransactionLog" }, // Lần nhập nào
});

export default mongoose.model("BookCopy", bookCopySchema);
