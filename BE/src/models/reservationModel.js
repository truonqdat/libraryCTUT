import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  books: [
    {
      bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
      barcode: { type: String }, // QR code sách đã đặt
      _id: false
    },
  ],
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected", "Completed", "Expired"],
    default: "Pending",
  },
  reservationCode: {
    type: String,
    unique: true,
  },
  requestDate: { type: Date, default: Date.now },
  approvedAt: { type: Date }, // Thời gian được duyệt
  validUntil: { type: Date }, // Thời điểm hết hạn hiệu lực (24h sau khi approved)
  rejectedAt: { type: Date }, // Thời gian bị từ chối
  completedAt: { type: Date }, // Thời gian hoàn thành
  rejectionReason: { type: String }, // Lý do từ chối
}, {
  versionKey: false // Tắt field __v
});

// Thêm index để tìm kiếm nhanh các reservation sắp hết hạn
reservationSchema.index({ status: 1, validUntil: 1 });

// Middleware tự động xóa reservation sau khi hoàn thành/hết hạn 30 ngày
reservationSchema.index(
  { status: 1, updatedAt: 1 }, 
  { expireAfterSeconds: 30 * 24 * 60 * 60 } // 30 ngày
);

export default mongoose.model("Reservation", reservationSchema);