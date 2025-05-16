import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

const BorrowRecordService = {
  createFromReservation: async (reservationCode, access_token) => {
    try {
      console.log("Calling createFromReservation with code:", reservationCode);
      const response = await axios.post(
        `${BASE_URL}/borrows/from-reservation/${reservationCode}`,
        {},
        { headers: { token: `Bearer ${access_token}` } }
      );
      console.log("createFromReservation response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error in createFromReservation:",
        error.response?.data || error
      );
      throw error.response?.data || error;
    }
  },

  getAllRecords: async (filters = {}) => {
    try {
      const response = await axios.get(`${BASE_URL}/borrows/getAll`, {
        params: filters,
        headers: { token: `Bearer ${localStorage.getItem("accessToken")}` },
      });

      return response.data;
    } catch (error) {
      console.error("Error in getAllRecords:", error.response?.data || error);
      throw error.response?.data || error;
    }
  },

  checkOverdueBooks: async (access_token) => {
    try {
      console.log("Calling checkOverdueBooks");
      const response = await axios.post(
        `${BASE_URL}/borrows/check-overdue`,
        {},
        { headers: { token: `Bearer ${access_token}` } }
      );
      console.log("checkOverdueBooks response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error in checkOverdueBooks:",
        error.response?.data || error
      );
      throw error.response?.data || error;
    }
  },

  updateBookStatus: async (borrowId, barcode, status, access_token, user) => {
    try {
      console.log("Calling updateBookStatus with:", { borrowId, barcode, status, user });
      const response = await axios.post(
        `${BASE_URL}/borrows/update`,
        { borrowId, barcode, status, user },
        { headers: { token: `Bearer ${access_token}` } }
      );
      console.log("updateBookStatus response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error in updateBookStatus:",
        error.response?.data || error
      );
      throw error.response?.data || error;
    }
  },

  createDirectBorrow: async (userId, barcodes, access_token) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/borrows/direct`,
        { userId, barcodes },
        { headers: { token: `Bearer ${access_token}` } }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  returnBooks: async (borrowId, barcodes, access_token) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/borrows/${borrowId}/return`,
        { barcodes },
        { headers: { token: `Bearer ${access_token}` } }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  extendBorrow: async (borrowId, barcodes, extraDays, access_token) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/borrows/${borrowId}/extend`,
        { barcodes, extraDays },
        { headers: { token: `Bearer ${access_token}` } }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  markAsLost: async (borrowId, barcodes, access_token) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/borrows/${borrowId}/lost`,
        { barcodes },
        { headers: { token: `Bearer ${access_token}` } }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getRecordById: async (id, access_token) => {
    try {
      const response = await axios.get(`${BASE_URL}/borrows/${id}`, {
        headers: { token: `Bearer ${access_token}` },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  processScannedCodes: async ({ codes, userId }, access_token) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/borrows/process-scanned`,
        { codes, userId },
        { headers: { token: `Bearer ${access_token}` } }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getStatistics: async (access_token) => {
    try {
      const response = await axios.get(`${BASE_URL}/borrows/statistics`, {
        headers: { token: `Bearer ${access_token}` },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  addBooksToBorrow: async (borrowId, barcodes, access_token) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/borrows/${borrowId}/add-books`,
        { barcodes },
        { headers: { token: `Bearer ${access_token}` } }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default BorrowRecordService;