import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EditorPage from './pages/EditorPage';
import AppNavbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const hideNavbar = location.pathname === '/login' || location.pathname === '/register';

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {!hideNavbar && <AppNavbar />}
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
        <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/doc/:id" element={isAuthenticated ? <EditorPage /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;