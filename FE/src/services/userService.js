import axios from "axios";

const loginWithGoogle = async (token) => {
  const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/google-login`, { token });
  return response.data;
};

const getUserProfile = async (access_token) => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/profile`, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return response.data;
};

const logOut = async (req, res) => {
  let response = await axios.get(
    "http://localhost:3001/api/v1/dang-xuat-user",
    {
      withCredentials: true,
    }
  );
  return response;
};

const getAllBorrowBook = async (userId) => {
  const response = await axios.get(
    `http://localhost:3001/api/v1/danh-sach-muon/${userId}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

const updatePassword = async (userId, oldPassword, newPassword) => {
  const response = await axios.put(
    `http://localhost:3001/api/v1/cap-nhat-mat-khau`,
    {
      userId,
      oldPassword,
      newPassword,
    },
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export default {
  loginWithGoogle,
  getUserProfile,
  getAllBorrowBook,
  updatePassword,
};
