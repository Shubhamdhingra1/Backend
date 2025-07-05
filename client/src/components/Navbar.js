import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

export default function AppNavbar() {
  const { user, logout } = useAuth();
  
  return (
    <Navbar bg="dark" variant="dark" expand="lg" style={{ borderBottom: '1px solid #444' }}>
      <Navbar.Brand href="/" style={{ fontWeight: 'bold' }}>Realtime Collab</Navbar.Brand>
      <Nav className="ms-auto">
        {user && (
          <>
            <span className="navbar-text me-3" style={{ color: '#aaa' }}>
              Welcome, <strong style={{ color: '#fff' }}>{user.username}</strong>
            </span>
            <Button variant="outline-danger" onClick={logout}>
              Logout
            </Button>
          </>
        )}
      </Nav>
    </Navbar>
  );
}