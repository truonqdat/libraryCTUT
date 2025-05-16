import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;
const API_URL = `${BASE_URL}/reservations`;

const createReservation = async (access_token, books) => {
  const response = await axios.post(
    `${API_URL}/create`,
    { books },
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return response.data;
};

const approveReservation = async (access_token, reservationId) => {
  const response = await axios.patch(
    `${API_URL}/${reservationId}/approve`,
    {},
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return response.data;
};

const rejectReservation = async (access_token, reservationId, reason) => {
  const response = await axios.patch(
    `${API_URL}/${reservationId}/reject`,
    { reason },
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  return response.data;
};

const completeReservation = async (access_token, reservationId) => {
  const response = await axios.patch(
    `${API_URL}/${reservationId}/complete`,
    {},
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  return response.data;
};

const cancelReservation = async (access_token, reservationId) => {
  const response = await axios.patch(
    `${API_URL}/${reservationId}/cancel`,
    {},
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  return response.data;
};

const validateReservationCode = async (code) => {
  const response = await axios.get(`${API_URL}/validate/${code}`);
  return response.data;
};

const getReservationById = async (access_token, reservationId) => {
  const response = await axios.get(`${API_URL}/${reservationId}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return response.data;
};

const getUserReservations = async (access_token, status) => {
  const params = status ? { status } : {};
  const response = await axios.get(`${API_URL}/my-reservations`, {
    params,
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return response.data;
};

const getAllReservations = async (access_token, filters = {}) => {
  const response = await axios.get(API_URL, {
    params: filters,
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return response.data;
};

export default {
  createReservation,
  approveReservation,
  rejectReservation,
  completeReservation,
  cancelReservation,
  validateReservationCode,
  getReservationById,
  getUserReservations,
  getAllReservations,
};
