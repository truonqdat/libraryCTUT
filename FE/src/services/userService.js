import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

const loginWithGoogle = async (credentialToken) => {
  const response = await axios.post(`${BASE_URL}/user/google-login`, { token: credentialToken  });
  return response.data;
};

const getUserProfile = async (access_token) => {
  const response = await axios.get(`${BASE_URL}/user/profile`, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return response.data;
};

export default {
  loginWithGoogle,
  getUserProfile,
};