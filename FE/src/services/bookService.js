import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

// Book Service
const getAllBooks = async () => {
  const response = await axios.get(`${BASE_URL}/books/getAll`);
  return response.data;
};

const getBookById = async (id) => {
  const response = await axios.get(`${BASE_URL}/books/${id}`);
  return response.data;
};

const createBook = async (bookData, access_token) => {
  const response = await axios.post(`${BASE_URL}/books/create`, bookData, {
    headers: {
      "Content-Type": "multipart/form-data",
      token: `Bearer ${access_token}`,
    },
  });
  return response.data;
};

const updateBook = async (id, bookData, access_token) => {
  const response = await axios.put(`${BASE_URL}/books/update/${id}`, bookData, {
    headers: {
      token: `Bearer ${access_token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const deleteBook = async (id, access_token) => {
  const response = await axios.delete(`${BASE_URL}/books/del/${id}`, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return response.data;
};

// Lấy sách theo danh mục khoa
const getBooksByFaculty = async (facultyId) => {
  const response = await axios.get(
    `${BASE_URL}/books/by-faculty/${facultyId}`
  );
  return response.data;
};

// Lấy sách theo danh mục ngành
const getBooksByCategory = async (categoryId) => {
  const response = await axios.get(
    `${BASE_URL}/books/by-category/${categoryId}`
  );
  return response.data;
};

// BookCopy Service
const importBookCopies = async (bookId, quantity, access_token) => {
  const response = await axios.post(
    `${BASE_URL}/books/${bookId}/import`,
    { quantity },
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return response.data;
};

const getBookCopies = async (bookId) => {
  const response = await axios.get(`${BASE_URL}/books/${bookId}/copies`);
  return response.data;
};

const updateBookCopy = async (bookId, data, access_token) => {
  const response = await axios.patch(
    `${BASE_URL}/copies/update/${bookId}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return response.data;
};

const downloadEbook = async (bookId, fileType, accessToken) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/books/${bookId}/download`,
      { fileType },
      {
        headers: {
          token: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        responseType: "blob", // Expect a binary file response
      }
    );

    // Create a URL for the blob and trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    // Extract filename from Content-Disposition header or use a default
    const contentDisposition = response.headers["content-disposition"];
    let fileName = `ebook-${bookId}.${fileType.split("/")[1]}`; // Default: e.g., ebook-123.pdf
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="(.+)"/);
      if (match) fileName = match[1];
    }
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to download eBook"
    );
  }
};

export default {
  // Book methods
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getBooksByFaculty,
  getBooksByCategory,

  // BookCopy methods
  importBookCopies,
  downloadEbook,
  getBookCopies,
  updateBookCopy,
};
