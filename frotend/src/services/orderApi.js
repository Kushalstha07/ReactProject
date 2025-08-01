import axios from "axios";
 
const API = "http://localhost:3000/api/order"; // Fixed endpoint

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};
 
export const createOrder = (data) => {
  const headers = getAuthHeaders();
  return axios.post(API, data, { headers });
};
export const getUserOrders = (userId) => axios.get(`${API}/user/${userId}`, { headers: getAuthHeaders() });
export const getOrderById = (id) => axios.get(`${API}/${id}`, { headers: getAuthHeaders() });
export const getOrderByNumber = (orderNumber) => axios.get(`${API}/number/${orderNumber}`);
export const updateOrderStatus = (id, status) => axios.put(`${API}/${id}/status`, { status }, { headers: getAuthHeaders() });
export const getAllOrders = () => axios.get(API, { headers: getAuthHeaders() }); 