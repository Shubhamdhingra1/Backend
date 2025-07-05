import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #23272e 0%, #181c20 100%)'
    }}>
      <div style={{ textAlign: 'center' }}>
        <Spinner 
          animation="border" 
          variant="primary" 
          style={{ width: '3rem', height: '3rem' }}
        />
        <div style={{ 
          marginTop: '1rem', 
          color: '#fff', 
          fontSize: '1.1rem',
          fontWeight: '500'
        }}>
          Loading...
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner; 