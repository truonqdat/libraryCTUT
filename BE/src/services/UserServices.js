import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const loginWithGoogle = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload(); // Lấy dữ liệu từ token
  const { email, name, hd } = payload;

  if (
    !email.endsWith("@student.ctuet.edu.vn") &&
    !email.endsWith("@ctuet.edu.vn")
  ) {
    throw new Error("Email không thuộc CTUET!");
  }

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ email, fullName: name });
  }

  // Tạo JWT token cho hệ thống của bạn
  const accessToken = jwt.sign(
    { id: user._id, email: user.email, isAdmin: user.isAdmin },
    process.env.ACCESS_TOKEN,
    { expiresIn: "7d" }
  );

  return { user, accessToken };
};

const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new Error("Không tìm thấy người dùng");
  }
  return user;
};

export default { loginWithGoogle, getUserProfile };
