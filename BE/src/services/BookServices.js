import Book from "../models/BookModel.js";
import BookCopy from "../models/BookCopyModel.js";

const BookService = {
  // Tạo sách mới
  createBook: async (bookData, files) => {
    const { formats, physicalCopies = {}, ...rest } = bookData;

    // VALIDATION
    if (!Array.isArray(formats) || formats.length === 0) {
      throw new Error("At least one format is required");
    }

    const validFormats = ["physical", "ebook"];
    if (formats.some((f) => !validFormats.includes(f))) {
      throw new Error(
        `Invalid format. Only accept: ${validFormats.join(", ")}`
      );
    }

    // Validate cover image (required)
    const coverFile = files?.cover?.[0];
    if (!coverFile) {
      throw new Error("Cover image is required");
    }

    // Xử lý bản vật lý
    if (formats.includes("physical")) {
      const total = Number(physicalCopies?.total) || 0;
      if (isNaN(total) || total < 0) {
        throw new Error(
          "Physical copies total must be a positive number or zero"
        );
      }
      rest.physicalCopies = {
        total,
        available: total,
      };
    } else {
      rest.physicalCopies = null;
    }

    // Xử lý bản điện tử
    let digitalAssets = [];
    if (formats.includes("ebook")) {
      const ebookFile = files?.ebook?.[0];
      if (!ebookFile) {
        throw new Error("eBook file required for ebook format");
      }
      digitalAssets = [
        {
          fileUrl: `/uploads/ebooks/${ebookFile.filename}`,
          fileType: ebookFile.type,
          downloadCount: 0,
        },
      ];
    }

    // Kiểm tra các trường bắt buộc
    if (!rest.title?.trim()) throw new Error("Title is required");
    if (!rest.author?.trim()) throw new Error("Author is required");

    // Tạo sách mới
    const newBook = new Book({
      ...rest,
      formats,
      digitalAssets,
      coverImage: `/uploads/covers/${coverFile.filename}`,
    });

    return await newBook.save();
  },

  // Thêm file ebook
  addDigitalAsset: async (bookId, file) => {
    const book = await Book.findById(bookId);
    if (!book) throw new Error("Book not found");
    if (!book.formats.includes("ebook")) {
      throw new Error("Book does not support ebook format");
    }

    if (!file) {
      throw new Error("eBook file is required");
    }

    const assetData = {
      filePath: `/uploads/ebooks/${file.filename}`,
      fileType: file.mimetype,
      downloadCount: 0,
    };

    book.digitalAssets.push(assetData);
    return await book.save();
  },

  // Lấy tất cả sách
  getAllBooks: async (query = {}) => {
    return await Book.find(query).populate("categoryId facultyId");
  },

  // Lấy chi tiết sách
  getBookById: async (id) => {
    return await Book.findById(id).populate("categoryId facultyId");
  },

  updateBook: async (bookId, bookData, files) => {
    const book = await Book.findById(bookId);
    if (!book) throw new Error("Book not found");

    const { formats, digitalAssets, ...rest } = bookData;

    // VALIDATION
    if (formats !== undefined) {
      if (!Array.isArray(formats) || formats.length === 0) {
        throw new Error("At least one format is required");
      }

      const validFormats = ["physical", "ebook"];
      if (formats.some((f) => !validFormats.includes(f))) {
        throw new Error(
          `Invalid format. Only accept: ${validFormats.join(", ")}`
        );
      }
      rest.formats = formats;
    }

    // Xử lý ảnh bìa
    if (files?.cover?.[0]) {
      rest.coverImage = `/uploads/covers/${files.cover[0].filename}`;
    }

    // Xử lý bản điện tử
    if (
      (formats && formats.includes("ebook")) ||
      book.formats.includes("ebook")
    ) {
      if (files?.ebook?.[0]) {
        const newAsset = {
          fileUrl: `/uploads/ebooks/${files.ebook[0].filename}`,
          fileType: files.ebook[0].type,
          downloadCount: 0,
        };
        rest.digitalAssets = digitalAssets
          ? [...digitalAssets, newAsset]
          : [...book.digitalAssets, newAsset];
      }
    } else {
      rest.digitalAssets = [];
    }

    // Kiểm tra các trường bắt buộc
    if (rest.title && !rest.title.trim()) throw new Error("Title is required");
    if (rest.author && !rest.author.trim())
      throw new Error("Author is required");
    if (rest.facultyId === undefined && !book.facultyId)
      throw new Error("Faculty is required");

    // Cập nhật thông tin sách
    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { $set: rest },
      { new: true, runValidators: true }
    ).populate("categoryId facultyId");

    return updatedBook;
  },

  // Tăng số lượt tải ebook
  incrementDownloadCount: async (bookId, fileType) => {
    const book = await Book.findById(bookId);
    if (!book) throw new Error("Book not found");

    const asset = book.digitalAssets.find((a) => a.fileType === fileType);
    if (!asset) throw new Error("File type not available");

    asset.downloadCount += 1;
    await book.save();
    return asset;
  },

  // Lấy tất cả bản sao của một cuốn sách
  getBookCopies: async (bookId) => {
    const book = await Book.findById(bookId);
    if (!book) throw new Error("Book not found");

    if (!book.formats.includes("physical")) {
      return [];
    }

    return await BookCopy.find({ bookId }).populate("importRecordId");
  },

  // Lấy sách theo danh mục khoa
  getBooksByFaculty: async (facultyId) => {
    const books = await Book.find({ facultyId });
    return books;
  },

  // Lấy sách theo danh mục ngành
  getBooksByCategory: async (categoryId) => {
    const books = await Book.find({ categoryId });
    return books;
  },
};

export default BookService;
