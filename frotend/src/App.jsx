import React from 'react'; 
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import UserRoutes from './routes/UserRoutes'
import './App.css'
 
function App() { 
  return ( 
    <div className="App">
      <ScrollToTop />
      <Header />
      <main className="main-content">
        <UserRoutes />
      </main>
      <Footer />
    </div>
  ); 
} 
 
export default App; 
