// Configuration for different environments
const config = {
  // Development environment
  development: {
    backendUrl: process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'
  },
  // Production environment
  production: {
    backendUrl: process.env.REACT_APP_BACKEND_URL || 'https://realtime-collaboration-platform-backend.onrender.com'
  }
};

// Get current environment
const environment = process.env.NODE_ENV || 'development';

// Export the appropriate configuration
export const BACKEND_URL = config[environment].backendUrl;

export default config[environment]; 