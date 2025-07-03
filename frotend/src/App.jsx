import React from 'react'; 
import { Routes, Route } from 'react-router-dom'; 
import Homepage from './public/Home'; 
import Login from './public/Login'; 
import Register from './public/Register'; 
 
function App() { 
  return ( 
    <Routes> 
      <Route path="/" element={<Homepage />} /> 
      <Route path="/login" element={<Login />} /> 
      <Route path="/register" element={<Register />} /> 
    </Routes> 
  ); 
} 
 
export default App; 
