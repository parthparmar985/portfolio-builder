import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import ContactUs from './pages/ContactUs';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PortfolioForm from './pages/PortfolioForm';
import PortfolioView from './pages/PortfolioView';
import AdminEditPortfolio from './pages/AdminEditPortfolio';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const App = () => {
  const { loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#64748b', fontSize: '1.25rem', fontWeight: '500' }}>
        Loading experience...
      </div>
    );
  }

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main className="container" style={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/create-portfolio" element={<PortfolioForm />} />
            <Route path="/portfolio/:userId" element={<PortfolioView />} />
            <Route path="/admin/edit-portfolio/:userId" element={<AdminEditPortfolio />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
