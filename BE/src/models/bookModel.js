import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    ISBN: { type: String, unique: true }, // Mã định danh tựa sách
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    totalCopies: { type: Number, default: 0 }, // Tổng số bản copy
    availableCopies: { type: Number, default: 0 }, // Số bản có sẵn
    description: { type: String },
    publishedYear: { type: Number },
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },
    coverImage: { type: String }, // URL ảnh bìa
  },
  { timestamps: true }
);

export default mongoose.model("Book", bookSchema);
