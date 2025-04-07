import Book from '../models/book.model.js';

// Tạo sách mới
export const createBook = async (bookData) => {
  const book = new Book(bookData);
  return await book.save();
};

// Lấy tất cả sách (có phân trang, tìm kiếm, lọc)
export const getBooks = async ({ page = 1, limit = 10, search = '', categoryId }) => {
  const query = {};
  
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { author: { $regex: search, $options: 'i' } },
      { ISBN: { $regex: search, $options: 'i' } }
    ];
  }

  if (categoryId) query.categoryId = categoryId;

  const [books, total] = await Promise.all([
    Book.find(query)
      .populate('categoryId', 'name')
      .skip((page - 1) * limit)
      .limit(limit),
    Book.countDocuments(query)
  ]);

  return { books, total, page, totalPages: Math.ceil(total / limit) };
};

// Lấy sách theo ID
export const getBookById = async (id) => {
  return await Book.findById(id).populate('categoryId', 'name');
};

// Cập nhật sách
export const updateBook = async (id, updateData) => {
  return await Book.findByIdAndUpdate(id, updateData, { new: true });
};

// Xóa sách
export const deleteBook = async (id) => {
  return await Book.findByIdAndDelete(id);
};

// Cập nhật số lượng sách (khi nhập/xuất bản copy)
export const updateBookCopies = async (bookId, change) => {
  return await Book.findByIdAndUpdate(
    bookId,
    { 
      $inc: { 
        totalCopies: change.totalCopies || 0, 
        availableCopies: change.availableCopies || 0 
      } 
    },
    { new: true }
  );
};