import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    ISBN: { type: String, unique: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    
    // Thông tin định dạng
    formats: {
      type: [{
        type: String,
        enum: ["physical", "ebook"],
        required: true
      }],
      default: ["physical"]
    },

    // Quản lý bản vật lý
    physicalCopies: {
      total: { type: Number, default: 0 },
      available: { type: Number, default: 0 }
    },

    // Quản lý bản điện tử
    digitalAssets: [{
      fileType: { 
        type: String,
        enum: ["pdf", "pptx", "ppt"],
      },
      fileUrl: { type: String, required: true },
      fileSize: { type: String }, // "10MB
      downloadCount: { type: Number, default: 0 }
    }],

    // Thông tin chung
    description: { type: String },
    publishedYear: { type: Number },
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: true
    },
    coverImage: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Book", bookSchema);