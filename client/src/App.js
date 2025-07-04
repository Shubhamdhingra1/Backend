import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EditorPage from './pages/EditorPage';
import AppNavbar from './components/Navbar';

function App() {
  const isAuth = !!localStorage.getItem('token');
  const location = useLocation();
  const hideNavbar = location.pathname === '/login' || location.pathname === '/register';
  return (
    <>
      {!hideNavbar && <AppNavbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={isAuth ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/doc/:id" element={isAuth ? <EditorPage /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
}
export default App;