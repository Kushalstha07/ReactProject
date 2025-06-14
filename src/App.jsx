import React from 'react'; 
import { Routes, Route } from 'react-router-dom'; 
import Homepage from './Home'; 
import Login from './Login'; 
import Register from './Register'; 
 
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
