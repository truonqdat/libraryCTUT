import express from "express";
import userController from "../controllers/UserControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/google-login", userController.googleLogin);
router.get("/profile", authMiddleware.authMiddleware, userController.getUserProfile);
router.put("/profile", authMiddleware.authMiddleware, userController.updateUserProfile);

export default router;