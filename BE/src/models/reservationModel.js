import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  books: [
    {
      bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
      barcode: { type: String }, // QR code sách đã đặt
    },
  ],
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected", "Completed"],
    default: "Pending",
  },
  reservationCode: {
    type: String,
    unique: true,
  },
  requestDate: { type: Date, default: Date.now },
  approvedAt: { type: Date }, // Thời gian được duyệt
});

export default mongoose.model("Reservation", reservationSchema);


