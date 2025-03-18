import axios from 'axios'

const getAllContact = async () => {
    const response = await axios.get(`http://localhost:3001/api/v1/phan-hoi`);
    return response.data; 
};
const addContact = async (formData) => {
    const response = await axios.post(`http://localhost:3001/api/v1/them-phan-hoi`,formData);
    return response; 
};
export default { getAllContact, addContact };