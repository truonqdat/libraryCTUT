import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;
const API_URL = `${BASE_URL}/transactions`;

const createTransaction = async (access_token, transactionData) => {
  const response = await axios.post(
    `${API_URL}/create`,
    transactionData,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return response.data;
};

const getAllTransactions = async (access_token, filters = {}) => {
  const response = await axios.get(`${API_URL}/getAll`, {
    params: filters,
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return response.data;
};

const getTransactionById = async (access_token, transactionId) => {
  const response = await axios.get(`${API_URL}/${transactionId}`, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return response.data;
};

const getTransactionsByBook = async (access_token, bookId) => {
  const response = await axios.get(`${API_URL}/book/${bookId}`, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return response.data;
};

const importBooks = async (access_token, bookId, quantity, note = "") => {
  const response = await axios.post(
    `${API_URL}/import`,
    { bookId, quantity, note },
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return response.data;
};

const exportBooks = async (access_token, bookId, quantity, note = "") => {
  const response = await axios.post(
    `${API_URL}/export`,
    { bookId, quantity, note },
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return response.data;
};

const issueBook = async (access_token, bookId, barcode, note = "") => {
  const response = await axios.post(
    `${API_URL}/issue`,
    { bookId, barcode, note },
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return response.data;
};

const returnBook = async (access_token, bookId, barcode, note = "") => {
  const response = await axios.post(
    `${API_URL}/return`,
    { bookId, barcode, note },
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return response.data;
};

const markBookAsLost = async (access_token, bookId, barcode, note = "") => {
  const response = await axios.post(
    `${API_URL}/lost`,
    { bookId, barcode, note },
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return response.data;
};

export default {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  getTransactionsByBook,
  importBooks,
  exportBooks,
  issueBook,
  returnBook,
  markBookAsLost,
};