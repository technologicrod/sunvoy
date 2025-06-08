import React, { useEffect, useState } from 'react';
import './App.css';
import Axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Home from './Home'; 
import Settings from './Settings';

const Erorr404Page: React.FC = () => {
  const path = window.location.pathname;
  const method = "GET";

  return (
    <div style={{ padding: 20 }}>
      <h4>{`Cannot ${method} ${path}`}</h4>
    </div>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    Axios.get('http://localhost:3001/getauth', { withCredentials: true })
      .then(res => {
        setIsAuthenticated(res.data.valid);
      })
      .catch(err => {
        console.error('App - getauth', err);
        setIsAuthenticated(false);
      });
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/list" replace /> : <Navigate to="/login" replace />}
        />
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/list" element={<Home />} />
        <Route path="/settings" element={<Settings />} />

         <Route path="*" element={<Erorr404Page />} />
      </Routes>
    </Router>
  );
};

export default App;
