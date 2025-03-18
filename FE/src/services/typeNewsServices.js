import axios from 'axios'

const getAllTypeNews = async () => {
    const response = await axios.get(`http://localhost:3001/api/v1/loai-tin-tuc`);
    return response.data; 
};


export default { getAllTypeNews };