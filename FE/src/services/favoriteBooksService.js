import axios from 'axios'


const getFavoriteBooks = async () => {
  const response = await axios.get(
    `http://localhost:3001/api/v1/lay-ta-ca-yeu-thich-sach`
  )
  return response.data
}
const getFavoriteBooksByUserId = async (userId) => {
  const response = await axios.get(
    `http://localhost:3001/api/v1/lay-yeu-thich-sach/${userId}`,
    { withCredentials: true }
  )
  return response.data
}
const getIdFavoriteBooksByUserId = async (userId) => {
  const response = await axios.get(
    `http://localhost:3001/api/v1/lay-id-yeu-thich-sach/${userId}`,
    { withCredentials: true }
  )
  return response.data
}
const removeFavoriteBook = async (userId,bookId) => {
  const response = await axios.post(
    `http://localhost:3001/api/v1/xoa-yeu-thich-sach`,
    {userId,bookId},
    { withCredentials: true }
  )
  return response.data
}
const addFavoriteBook = async (userId,bookId) => {
  const response = await axios.post(
    `http://localhost:3001/api/v1/them-yeu-thich-sach`,
    {userId,bookId},
    { withCredentials: true }
  )
  return response.data
}
export default { getFavoriteBooks,getFavoriteBooksByUserId, getIdFavoriteBooksByUserId, removeFavoriteBook, addFavoriteBook }
