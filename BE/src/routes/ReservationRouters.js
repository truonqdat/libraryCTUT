import express from "express";
import ReservationController from "../controllers/ReservationControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js"

const router = express.Router();

// User routes
router.post("/create", authMiddleware.isLibrarianMiddleware, ReservationController.createReservation);
router.get("/my-reservations", ReservationController.getUserReservations);
router.patch("/:id/cancel", ReservationController.cancelReservation);

// Admin routes
router.get("/", ReservationController.getAllReservations);
router.patch("/:id/approve", authMiddleware.isLibrarianMiddleware, ReservationController.approveReservation);
router.patch("/:id/reject", ReservationController.rejectReservation);
router.patch("/:id/complete", ReservationController.completeReservation);

// Public routes (for QR validation)
router.get("/validate/:code", ReservationController.validateReservationCode);
router.get("/:id", ReservationController.getReservationById);

export default router;