import axios from "axios";
 
const API = "http://localhost:3000/api/orders";

const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});
 
export const createOrder = (data) => axios.post(API, data, { headers: getAuthHeaders() });
export const getUserOrders = (userId) => axios.get(`${API}/user/${userId}`, { headers: getAuthHeaders() });
export const getOrderById = (id) => axios.get(`${API}/${id}`, { headers: getAuthHeaders() });
export const updateOrderStatus = (id, status) => axios.put(`${API}/${id}/status`, { status }, { headers: getAuthHeaders() });
export const getAllOrders = () => axios.get(API, { headers: getAuthHeaders() }); 