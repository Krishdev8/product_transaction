import axios from 'axios';

const API_URL = 'http://localhost:5000/api/products'; // Backend URL

// Get Transactions List
export const getTransactions = (month, search = '', page = 1, perPage = 10) => {
    return axios.get(`${API_URL}/transactions`, { params: { month, search, page, perPage } });
};

// // Getting Statistics
// export const getStatistics = (month) => {
//     return axios.get(`${API_URL}/statistics`, { params: { month } });
// };

// // Get Price Range (Bar Chart)
// export const getPriceRange = (month) => {
//     return axios.get(`${API_URL}/price-range`, { params: { month } });
// };

// // Get Category Items (Pie Chart)
// export const getCategoryItems = (month) => {
//     return axios.get(`${API_URL}/category-items`, { params: { month } });
// };

// // Combined API call
// export const getCombinedData = (month) => {
//     return axios.get(`${API_URL}/combined`, { params: { month } });
// };
