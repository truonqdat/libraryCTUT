import axios from 'axios'

const getAllBooks = async () => {
    const response = await axios.get(`http://localhost:3001/api/v1/danh-muc/xem-tat-ca`);
    return response.data; 
};

const getBooksNew= async () => {
    const response = await axios.get(`http://localhost:3001/api/v1/sach-moi`);
    return response.data; 
};

const getBookById = async (id) => {
    const response = await axios.get(`http://localhost:3001/api/v1/chi-tiet-sach/${id}`);
    return response.data; 
};

const requestBook = async ({ user, book }) => {
    const response = await axios.post(`http://localhost:3001/api/v1/yeu-cau-muon`, { user, book }, { withCredentials: true });
    return response.data; 
};

const getBooksByCategory = async (categoryId) => {
    const response = await axios.get(`http://localhost:3001/api/v1/danh-muc/${categoryId}`);
    return response.data;
};
const getAllBooksBySearch = async (data) => {
    
    const response = await axios.post(`http://localhost:3001/api/v1/tim-kiem-sach`,data);
    // console.log(response.data.search);
    // console.log(data);
    return response.data;
};
export default { getAllBooks, getBookById, getBooksByCategory, getBooksNew, getAllBooksBySearch, requestBook};