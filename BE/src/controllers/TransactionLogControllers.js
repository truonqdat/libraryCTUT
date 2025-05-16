import TransactionLogService from "../services/TransactionLogServices.js";

const TransactionLogController = {
  // Tạo giao dịch
  createTransaction: async (req, res) => {
    try {
      // Thêm operatorId từ người dùng đăng nhập
      const transactionData = {
        ...req.body,
        operatorId: req.user.id
      };

      const transaction = await TransactionLogService.createTransaction(transactionData);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Lấy danh sách giao dịch
  getTransactions: async (req, res) => {
    try {
      const transactions = await TransactionLogService.getTransactions(req.query);
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export default TransactionLogController;