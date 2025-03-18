import axios from 'axios';

const getAllNews = async (type, sort, search) => {
    const response = await axios.get(`http://localhost:3001/api/v1/tin-tuc?type=${type}&sort=${sort}&title=${search}`);
    return response.data; 
};

const getNews = async (id) => {
    const response = await axios.get(`http://localhost:3001/api/v1/chi-tiet-tin-tuc/${id}`);
    return response.data; 
};

const getAllNewsHome = async () => {
    const response = await axios.get(`http://localhost:3001/api/v1/tin-tuc-home`);
    return response.data; 
};

export default { getAllNews, getNews, getAllNewsHome };