import { createSlice } from "@reduxjs/toolkit";

// Hàm helper để đọc từ localStorage an toàn
const safeParse = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage:`, error);
    return null;
  }
};

const initialState = {
  currentUser: safeParse("user"),
  accessToken: localStorage.getItem("accessToken") || null,
  isAuthenticated: !!localStorage.getItem("accessToken") && !!safeParse("user"),
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token } = action.payload;
      state.currentUser = user;
      state.accessToken = token;
      state.isAuthenticated = true;
      
      try {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("accessToken", token);
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    },
    updateUser: (state, action) => {
      state.currentUser = { ...state.currentUser, ...action.payload };
      try {
        localStorage.setItem("user", JSON.stringify(state.currentUser));
      } catch (error) {
        console.error("Error updating user in localStorage:", error);
      }
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      state.isAuthenticated = !!action.payload;
      try {
        localStorage.setItem("accessToken", action.payload);
      } catch (error) {
        console.error("Error saving token to localStorage:", error);
      }
    },
    logout: (state) => {
      state.currentUser = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      
      try {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
      } catch (error) {
        console.error("Error clearing localStorage:", error);
      }
    },
  },
});

export const { setUser, updateUser, setAccessToken, logout } = userSlice.actions;
export default userSlice.reducer;