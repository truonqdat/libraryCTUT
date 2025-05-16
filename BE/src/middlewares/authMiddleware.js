import jwt from "jsonwebtoken";
import "dotenv/config.js";

const authMiddleware = (req, res, next) => {
  const token = req.headers.token?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập!" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token không hợp lệ!" });
    }
    req.user = user;

    // Skip profile completion check for profile-related routes
    if (req.path === "/profile" || req.path === "/google-login") {
      return next();
    }

    // // Check if profile is incomplete
    // if (!user.profileCompleted) {
    //   return res.status(403).json({ message: "Vui lòng hoàn thiện thông tin hồ sơ trước!" });
    // }

    next();
  });
};

const isLibrarianMiddleware = (req, res, next) => {
  authMiddleware(req, res, () => {
    if (req.user?.role === "librarian" || req.user?.role === "admin") {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "Chỉ thủ thư hoặc admin mới có quyền!" });
    }
  });
};

const isAdminMiddleware = (req, res, next) => {
  authMiddleware(req, res, () => {
    if (req.user?.role === "admin") {
      next();
    } else {
      return res.status(403).json({ message: "Bạn không có quyền truy cập!" });
    }
  });
};

export default { authMiddleware, isLibrarianMiddleware, isAdminMiddleware };