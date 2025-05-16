import TransactionLog from "../models/TransactionLogModel.js";
import Book from "../models/BookModel.js";
import BookCopy from "../models/BookCopyModel.js";

const TransactionLogService = {
  createTransaction: async (transactionData) => {
    const { bookId, operationType, quantity = 1, barcode, operatorId } = transactionData;

    // Kiểm tra operatorId
    if (!operatorId) {
      throw new Error("Operator ID is missing or invalid");
    }

    const book = await Book.findById(bookId);
    if (!book) throw new Error("Book not found");

    switch (operationType) {
      case "Import":
        return await TransactionLogService._handleImport(book, transactionData);
      case "Export":
        return await TransactionLogService._handleExport(book, transactionData);
      case "Issue":
      case "Lost":
      case "Return": // Thêm xử lý cho Return
        if (!barcode) throw new Error("Barcode is required");
        return await TransactionLogService._handleStatusChange(book, transactionData);
      default:
        throw new Error("Invalid operation type");
    }
  },

  _handleImport: async (book, transactionData) => {
    const { quantity } = transactionData;
    const barcodes = [];
    
    const transaction = await TransactionLog.create({
      ...transactionData,
    });

    for (let i = 0; i < quantity; i++) {
      const barcode = `BK-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      await BookCopy.create({
        bookId: book._id,
        barcode,
        status: "Available",
        importRecordId: transaction._id
      });
      barcodes.push(barcode);
    }

    await Book.findByIdAndUpdate(book._id, {
      $inc: { 
        "physicalCopies.total": quantity,
        "physicalCopies.available": quantity 
      }
    });

    transaction.barcodes = barcodes;
    await transaction.save();
    return transaction;
  },

  _handleExport: async (book, transactionData) => {
    const { quantity } = transactionData;
    const copies = await BookCopy.find({
      bookId: book._id,
      status: "Available"
    }).limit(quantity);

    if (copies.length < quantity) throw new Error("Not enough available copies");

    const transaction = await TransactionLog.create({
      ...transactionData,
      barcode: null,
      barcodes: copies.map(c => c.barcode)
    });

    await BookCopy.updateMany(
      { _id: { $in: copies.map(c => c._id) } },
      { status: "Borrowed" } // Sửa từ "Export" thành "Borrowed" để nhất quán
    );

    await Book.findByIdAndUpdate(book._id, {
      $inc: { "physicalCopies.available": -quantity }
    });

    return transaction;
  },

  _handleStatusChange: async (book, transactionData) => {
    const { barcode, operationType } = transactionData;
    const copy = await BookCopy.findOne({ barcode, bookId: book._id });
    if (!copy) throw new Error("Book copy not found");

    const transaction = await TransactionLog.create(transactionData);
    
    if (operationType === "Issue") {
      copy.status = "Borrowed";
      await Book.findByIdAndUpdate(book._id, {
        $inc: { "physicalCopies.available": -1 }
      });
    } else if (operationType === "Lost") {
      copy.status = "Lost";
      await Book.findByIdAndUpdate(book._id, {
        $inc: { "physicalCopies.total": -1, "physicalCopies.available": -1 }
      });
    } else if (operationType === "Return") {
      copy.status = "Available";
      await Book.findByIdAndUpdate(book._id, {
        $inc: { "physicalCopies.available": 1 }
      });
    }

    await copy.save();
    return transaction;
  },

  getTransactions: async (query = {}) => {
    return await TransactionLog.find(query)
      .populate("bookId operatorId")
      .sort({ createdAt: -1 });
  }
};

export default TransactionLogService;