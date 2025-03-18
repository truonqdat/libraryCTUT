import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
    required: true,
  },
  totalCopies: { type: Number, required: true },
  availableCopies: { type: Number, required: true },
  publishedYear: { type: Number },
  description: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Book", bookSchema);
