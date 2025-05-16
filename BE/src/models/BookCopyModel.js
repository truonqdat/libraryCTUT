import mongoose from "mongoose";

const bookCopySchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  barcode: { type: String, unique: true, required: true }, // QR code
  status: {
    type: String,
    enum: ["Available", "Borrowed", "Pending", "Reserved", "Lost"],
    default: "Available",
  },
  condition: {
    type: String,
    enum: ['New', 'Good', 'Damaged'],
    default: 'New'
  },
  location: { type: String, default: "" }, // Vị trí kệ sách
  importRecordId: { type: mongoose.Schema.Types.ObjectId, ref: "TransactionLog" }, // Lần nhập nào
});

export default mongoose.model("BookCopy", bookCopySchema);
