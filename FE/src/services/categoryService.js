import axios from 'axios'

const getAllCategories = async () => {
    const response = await axios.get(`http://localhost:3001/api/v1/danh-muc`);
    return response.data;
};

export default { getAllCategories };