import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

const getAllFaculties = async (access_token) => {
  const response = await axios.get(`${BASE_URL}/faculties/getAll`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return response.data;
};

const getFacultyById = async (id, access_token) => {
  const response = await axios.get(`${BASE_URL}/faculties/${id}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return response.data;
};

const createFaculty = async (facultyData, access_token) => {
  const response = await axios.post(`${BASE_URL}/faculties/create`, facultyData, {
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

const updateFaculty = async (id, facultyData, access_token) => {
  const response = await axios.post(`${BASE_URL}/faculties/update/${id}`, facultyData, {
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

const deleteFaculty = async (id, access_token) => {
  const response = await axios.delete(`${BASE_URL}/faculties/del/${id}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return response.data;
};

// const getBooksByFaculty = async (facultyId, access_token) => {
//   const response = await axios.get(`${BASE_URL}/faculties/${facultyId}/books`, {
//     headers: {
//       Authorization: `Bearer ${access_token}`,
//     },
//   });
//   return response.data;
// };

export default {
  getAllFaculties,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
//   getBooksByFaculty,
};