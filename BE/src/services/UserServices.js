import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const loginWithGoogle = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const { email, name, hd } = payload;

  if (
    !email.endsWith("@student.ctuet.edu.vn") &&
    !email.endsWith("@ctuet.edu.vn")
  ) {
    throw new Error("Email không thuộc CTUET!");
  }

  // Extract student code from email (e.g., tvdat2100143@student.ctuet.edu.vn -> 2100143)
  let studentCode;
  if (email.endsWith("@student.ctuet.edu.vn")) {
    const match = email.match(/^[a-zA-Z]+(\d+)@student\.ctuet\.edu\.vn$/);
    if (!match) {
      throw new Error("Email không đúng định dạng mã sinh viên!");
    }
    studentCode = match[1];
  } else {
    // For non-student emails (e.g., staff), generate a unique code or handle differently
    studentCode = `STAFF_${email.split("@")[0]}`;
  }

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      email,
      fullName: name,
      studentCode,
      profileCompleted: false,
    });
  } else if (user.studentCode !== studentCode) {
    // Update studentCode if it changes (unlikely but for robustness)
    user.studentCode = studentCode;
    await user.save();
  }

  const accessToken = jwt.sign(
    { id: user._id, email: user.email, role: user.role, profileCompleted: user.profileCompleted },
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

const updateUserProfile = async (userId, profileData) => {
  const { phoneNumber, dateOfBirth, gender } = profileData;

  // Validate required fields
  if (!phoneNumber || !dateOfBirth || !gender) {
    throw new Error("Vui lòng điền đầy đủ số điện thoại, ngày sinh và giới tính!");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("Không tìm thấy người dùng");
  }

  user.phoneNumber = phoneNumber;
  user.dateOfBirth = new Date(dateOfBirth);
  user.gender = gender;
  user.profileCompleted = true;

  await user.save();
  return user;
};

export default { loginWithGoogle, getUserProfile, updateUserProfile };