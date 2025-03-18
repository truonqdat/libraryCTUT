const reservationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Expired", "Rejected", "Completed"],
    default: "Pending",
  },
  requestDate: { type: Date, default: Date.now },
  approvedAt: { type: Date }, // Thời gian được duyệt
});
