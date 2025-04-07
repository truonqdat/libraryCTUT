import { createSlice } from "@reduxjs/toolkit";

// Kiểm tra nếu có dữ liệu user trong localStorage
const savedUser = JSON.parse(localStorage.getItem("user")) || null;

const initialState = {
  currentUser: savedUser,
  isAuthenticated: savedUser ? true : false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      // Lưu user vào localStorage
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      // Xóa user khỏi localStorage khi đăng xuất
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken"); // Nếu bạn lưu token riêng
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
