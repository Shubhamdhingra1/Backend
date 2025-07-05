import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register, error, clearError, loading } = useAuth();

  // Clear any existing errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const result = await register(form);
    if (result.success) {
      navigate('/');
    }
    
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <Container className="mt-5 d-flex justify-content-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #23272e 0%, #181c20 100%)',
      display: 'flex',
      alignItems: 'center'
    }}>
      <Container className="mt-5">
        <div style={{
          maxWidth: '400px',
          margin: '0 auto',
          background: '#23272e',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          border: '1px solid #444'
        }}>
          <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: '2rem' }}>Register</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#fff' }}>Username</Form.Label>
              <Form.Control 
                name="username" 
                onChange={handleChange}
                style={{ background: '#181c20', color: '#fff', border: '1px solid #444' }}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#fff' }}>Password</Form.Label>
              <Form.Control 
                name="password" 
                type="password" 
                onChange={handleChange}
                style={{ background: '#181c20', color: '#fff', border: '1px solid #444' }}
                required
              />
            </Form.Group>
            <Button 
              type="submit" 
              className="w-100" 
              variant="success"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Creating account...
                </>
              ) : (
                'Register'
              )}
            </Button>
          </Form>
          <div className="mt-3 text-center">
            <span style={{ color: '#aaa' }}>Already have an account? </span>
            <a href="/login" style={{ color: '#007bff' }}>Login</a>
          </div>
        </div>
      </Container>
    </div>
  );
}