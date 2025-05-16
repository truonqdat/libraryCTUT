import Book from "../models/BookModel.js";
import path from "path";
import fs from "fs";

const FileService = {
  uploadEbook: async (bookId, file) => {
    // 1. Kiểm tra sách
    const book = await Book.findById(bookId);
    if (!book) throw new Error("Không tìm thấy sách");
    if (!book.formats.includes("ebook")) {
      throw new Error("Sách này không hỗ trợ định dạng ebook");
    }

    // 2. Tạo URL truy cập
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    const fileUrl = `${baseUrl}/uploads/ebooks/${file.filename}`;

    // 3. Lưu thông tin file vào database
    const newAsset = {
      fileType: path.extname(file.originalname).replace(".", ""),
      fileUrl,
      filePath: file.path, // Lưu cả đường dẫn vật lý
      fileSize: formatFileSize(file.size)
    };

    book.digitalAssets.push(newAsset);
    await book.save();

    return {
      bookId: book._id,
      asset: newAsset
    };
  },

  deleteEbook: async (bookId, assetId) => {
    const book = await Book.findById(bookId);
    if (!book) throw new Error("Không tìm thấy sách");

    const asset = book.digitalAssets.id(assetId);
    if (!asset) throw new Error("Không tìm thấy file");

    // Xóa file vật lý
    if (fs.existsSync(asset.filePath)) {
      fs.unlinkSync(asset.filePath);
    }

    // Xóa trong database
    book.digitalAssets.pull(assetId);
    await book.save();

    return { success: true };
  }
};

// Hàm định dạng kích thước file
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i]);
}

export default FileService;