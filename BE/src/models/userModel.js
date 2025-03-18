import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, required: true, unique: true }, // ID Google OAuth
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: function (value) {
          return value.endsWith("@student.ctuet.edu.vn"); // Kiểm tra email trường
        },
        message: "Email phải thuộc hệ thống trường!",
      },
    },
    fullName: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ["admin", "librarian", "student"],
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png",
    },
    lock: { type: Boolean, default: false }, // Khóa tài khoản nếu vi phạm
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
