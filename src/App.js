import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ClientActivation from './components/Client/ClientActivation';
import ClientDashboard from './components/Client/ClientDashboard';
import MentorLogin from './components/Mentor/MentorLogin';
import MentorDashboard from './components/Mentor/MentorDashboard';
import MagicLinkHandler from './components/Shared/MagicLinkHandler';
import './App.css';

function App() {
  const user = JSON.parse(localStorage.getItem('maverick_user'));

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<ClientActivation />} />
          <Route path="/client/activate" element={<ClientActivation />} />
          <Route path="/mentor/login" element={<MentorLogin />} />
          <Route path="/auth" element={<MagicLinkHandler />} />
          
          {/* Protected Mentor Routes */}
          <Route 
            path="/mentor/dashboard" 
            element={user?.role === 'mentor' ? <MentorDashboard /> : <Navigate to="/mentor/login" />} 
          />
          
          {/* Protected Client Routes */}
          <Route 
            path="/client/dashboard" 
            element={user?.role === 'client' ? <ClientDashboard /> : <Navigate to="/client/activate" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;