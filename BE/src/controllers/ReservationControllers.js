import ReservationService from "../services/ReservationServices.js";
import QRCode from "qrcode"; // Import qrcode library

const ReservationController = {
  // Tạo đặt mượn mới
  createReservation: async (req, res) => {
    try {
      const reservation = await ReservationService.createReservation(
        req.user.id,
        req.body.books
      );

      // Generate QR code for reservationCode
      const qrCodeDataUrl = await QRCode.toDataURL(reservation.reservationCode);

      res.status(201).json({
        success: true,
        data: {
          ...reservation._doc,
          qrCode: qrCodeDataUrl, // Include QR code as base64 data URL
        },
        message: "Reservation created successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
        unavailableBooks: error.unavailableBooks || undefined,
      });
    }
  },

  // Duyệt đặt mượn
  approveReservation: async (req, res) => {
    try {
      const reservation = await ReservationService.approveReservation(
        req.params.id,
        req.user.id
      );
      res.status(200).json({
        success: true,
        data: reservation,
        message: "Reservation approved successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Từ chối đặt mượn
  rejectReservation: async (req, res) => {
    try {
      const reservation = await ReservationService.rejectReservation(
        req.params.id,
        req.auth.userId,
        req.body.reason
      );
      res.status(200).json({
        success: true,
        data: reservation,
        message: "Reservation rejected successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Hoàn thành đặt mượn
  completeReservation: async (req, res) => {
    try {
      const reservation = await ReservationService.completeReservation(
        req.params.id,
        req.auth.userId
      );
      res.status(200).json({
        success: true,
        data: reservation,
        message: "Reservation completed successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Hủy đặt mượn
  cancelReservation: async (req, res) => {
    try {
      const reservation = await ReservationService.cancelReservation(
        req.params.id,
        req.auth.userId
      );
      res.status(200).json({
        success: true,
        data: reservation,
        message: "Reservation cancelled successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Kiểm tra mã đặt mượn
  validateReservationCode: async (req, res) => {
    try {
      const reservation = await ReservationService.validateReservationCode(
        req.params.code
      );
      res.status(200).json({
        success: true,
        data: reservation,
        valid: true,
        message: "Valid reservation code",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        valid: false,
        message: error.message,
      });
    }
  },

  // Lấy thông tin đặt mượn theo ID
  getReservationById: async (req, res) => {
    try {
      const reservation = await ReservationService.getReservationById(
        req.params.id
      );
      if (!reservation) {
        return res.status(404).json({
          success: false,
          message: "Reservation not found",
        });
      }
      res.status(200).json({
        success: true,
        data: reservation,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Lấy danh sách đặt mượn của user
  getUserReservations: async (req, res) => {
    try {
      const reservations = await ReservationService.getUserReservations(
        req.auth.userId,
        req.query.status
      );
      res.status(200).json({
        success: true,
        data: reservations,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Lấy tất cả đặt mượn (Admin)
  getAllReservations: async (req, res) => {
    try {
      const filters = {
        status: req.query.status,
        userId: req.query.userId,
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo,
      };
      const reservations = await ReservationService.getAllReservations(filters);
      res.status(200).json({
        success: true,
        data: reservations,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
};

export default ReservationController;