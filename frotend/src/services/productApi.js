import axios from "axios";
 
const API = "http://localhost:3000/api/products";
 
export const getProducts = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return axios.get(`${API}?${queryString}`);
};

export const getProductById = (id) => axios.get(`${API}/${id}`);
export const createProduct = (data) => axios.post(API, data);
export const updateProduct = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteProduct = (id) => axios.delete(`${API}/${id}`); 