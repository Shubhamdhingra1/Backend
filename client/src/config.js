// Configuration for different environments
const config = {
  // Development environment
  development: {
    backendUrl: 'http://localhost:5000'
  },
  // Production environment
  production: {
    backendUrl: 'https://realtime-collaboration-platform-backend.onrender.com/' // Replace with your actual backend URL
  }
};

// Get current environment
const environment = process.env.NODE_ENV || 'development';

// Export the appropriate configuration
export const BACKEND_URL = config[environment].backendUrl;

export default config[environment]; 