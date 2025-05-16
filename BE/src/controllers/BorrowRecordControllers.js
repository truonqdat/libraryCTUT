import BorrowService from "../services/BorrowRecordServices.js";
import BarcodeService from "../services/BarcodeServices.js";

const BorrowController = {
  createFromReservation: async (req, res) => {
    try {
      console.log("createFromReservation called with code:", req.params.code); // Debug log
      const borrowRecord = await BorrowService.createFromReservation(
        req.params.code,
        req.user.id
      );
      res.status(201).json(borrowRecord);
    } catch (error) {
      console.error("Error in createFromReservation:", error); // Debug log
      res.status(400).json({ message: error.message });
    }
  },

  // New endpoint to handle QR code scan
  createFromQRCode: async (req, res) => {
    try {
      const { reservationCode } = req.body; // Expect reservationCode from scanned QR
      console.log("createFromQRCode called with code:", reservationCode); // Debug log
      if (!reservationCode) {
        throw new Error("Reservation code is missing");
      }
      const borrowRecord = await BorrowService.createFromReservation(
        reservationCode,
        req.user.id
      );
      res.status(201).json({
        success: true,
        data: borrowRecord,
        message: "Borrow record created successfully from QR code",
      });
    } catch (error) {
      console.error("Error in createFromQRCode:", error); // Debug log
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  createDirectBorrow: async (req, res) => {
    try {
      const borrowRecord = await BorrowService.createDirectBorrow(
        req.user._id,
        req.body.barcodes
      );
      res.status(201).json(borrowRecord);
    } catch (error) {
      console.error("Error in createDirectBorrow:", error); // Debug log
      res.status(400).json({ message: error.message });
    }
  },

  returnBooks: async (req, res) => {
    try {
      const updatedRecord = await BorrowService.returnBooks(
        req.params.id,
        req.body.barcodes
      );
      res.status(200).json(updatedRecord);
    } catch (error) {
      console.error("Error in returnBooks:", error); // Debug log
      res.status(400).json({ message: error.message });
    }
  },

  getBorrowRecord: async (req, res) => {
    try {
      console.log("getBorrowRecord called with id:", req.params.id); // Debug log
      const record = await BorrowService.getRecordById(req.params.id);
      if (!record) {
        return res.status(404).json({ message: "Record not found" });
      }
      res.status(200).json(record);
    } catch (error) {
      console.error("Error in getBorrowRecord:", error); // Debug log
      res.status(500).json({ message: error.message });
    }
  },

  getAllRecords: async (req, res) => {
    try {
      console.log("getAllRecords called with filters:", req.query); // Very useful debug log
      const filters = req.query;
      const records = await BorrowService.getAllRecords(filters);
      res.status(200).json(records);
    } catch (error) {
      console.error("Error in getAllRecords:", error); // Debug log
      res.status(500).json({ message: error.message });
    }
  },

  checkOverdueBooks: async (req, res) => {
    try {
      console.log("checkOverdueBooks called"); // Debug log
      await BorrowService.checkOverdueBooks();
      res
        .status(200)
        .json({ message: "Overdue books checked and fines created" });
    } catch (error) {
      console.error("Error in checkOverdueBooks:", error); // Debug log
      res.status(500).json({ message: error.message });
    }
  },

  scanCode: async (req, res) => {
    try {
      const result = await BarcodeService.scanCode(req.params.code);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error in scanCode:", error); // Debug log
      res.status(400).json({ message: error.message });
    }
  },

  processScannedCodes: async (req, res) => {
    try {
      const { codes } = req.body;
      console.log("processScannedCodes called with codes:", codes); // Debug log
      const borrowRecord = await BorrowService.processScannedCodes({
        codes,
        userId: req.user._id,
      });
      res.status(201).json(borrowRecord);
    } catch (error) {
      console.error("Error in processScannedCodes:", error); // Debug log
      res.status(400).json({ message: error.message });
    }
  },

  updateBookStatus: async (req, res) => {
    try {
      const { borrowId, barcode, status, user } = req.body;
      const effectiveUser = user || req.user;
      if (!effectiveUser || !effectiveUser.id) {
        throw new Error("User information is missing or invalid");
      }
      console.log("updateBookStatus called with:", {
        borrowId,
        barcode,
        status,
        effectiveUser,
      }); // Debug log
      const updatedRecord = await BorrowService.updateBookStatus(
        borrowId,
        barcode,
        status,
        effectiveUser
      );
      res.status(200).json(updatedRecord);
    } catch (error) {
      console.error("Error in updateBookStatus:", error); // Debug log
      res.status(400).json({ message: error.message });
    }
  },
};

export default BorrowController;