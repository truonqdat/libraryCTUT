import axios from 'axios'

const loginService = async (username, password) => {
  let response = await axios.post(
    'http://localhost:3001/api/v1/dang-nhap',
    {
      username,
      password
    },
    { withCredentials: true }
  )

  return response.data
}

const getInfoUser = async () => {
  let response = await axios.get(
    'http://localhost:3001/api/v1/thong-tin-nguoi-dung',
    { withCredentials: true }
  )
  return response.data
}

const logOut = async (req, res) => {
  let response = await axios.get(
    'http://localhost:3001/api/v1/dang-xuat-user',
    {
      withCredentials: true
    }
  )
  return response
}

const getAllBorrowBook = async (userId) => {
  const response = await axios.get(
    `http://localhost:3001/api/v1/danh-sach-muon/${userId}`,
    {
      withCredentials: true
    }
  )
  return response.data
}

const updatePassword = async (userId, oldPassword, newPassword) => {
  const response = await axios.put(
    `http://localhost:3001/api/v1/cap-nhat-mat-khau`,
    {
      userId,
      oldPassword,
      newPassword
    },
    {
      withCredentials: true
    }
  )

  return response.data
}

export default { loginService, getInfoUser, getAllBorrowBook, updatePassword }
