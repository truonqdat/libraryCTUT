import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

// Lấy tất cả danh mục
const getAllCategories = async (access_token) => {
  const response = await axios.get(`${BASE_URL}/categories/getAll`, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return response.data;
};

const getAllFetchFacultyies = async (access_token) => {
  const response = await axios.get(`${BASE_URL}/faculties/getAll`, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return response.data;
};

// Lấy chi tiết danh mục
const getCategoryById = async (id, access_token) => {
  const response = await axios.get(`${BASE_URL}/categories/${id}`, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return response.data;
};

// Tạo danh mục mới
const createCategory = async (categoryData, access_token) => {
  const response = await axios.post(`${BASE_URL}/categories/create`, categoryData, {
    headers: {
      token: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// Cập nhật danh mục
const updateCategory = async (id, categoryData, access_token) => {
  const response = await axios.post(`${BASE_URL}/categories/update/${id}`, categoryData, {
    headers: {
      token: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// Xóa danh mục
const deleteCategory = async (id, access_token) => {
  const response = await axios.delete(`${BASE_URL}/categories/del/${id}`, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return response.data;
};

// Lấy sách theo danh mục
// const getBooksByCategory = async (categoryId, access_token) => {
//   const response = await axios.get(`${BASE_URL}/categories/${categoryId}/books`, {
//     headers: {
//       token: `Bearer ${access_token}`,
//     },
//   });
//   return response.data;
// };

export default {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllFetchFacultyies
  // getBooksByCategory,
};