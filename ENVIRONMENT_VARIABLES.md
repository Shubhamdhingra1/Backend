# Environment Variables Documentation

This document explains all the environment variables required for the RealTimeCollab application.

## Quick Setup

### For Development

1. **Server Setup**:
   ```bash
   cd server
   # Create .env file with the following content:
   ```

   ```env
   # Required Variables
   MONGO_URI=mongodb://localhost:27017/realtime-collab
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   NODE_ENV=development
   ```

2. **Client Setup**:
   ```bash
   cd client
   # Create .env file with the following content:
   ```

   ```env
   # Required Variables
   REACT_APP_BACKEND_URL=http://localhost:5000
   NODE_ENV=development
   ```

## Server Environment Variables

### Required Variables

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/realtime-collab` |
| `JWT_SECRET` | Secret key for JWT token signing | `your-super-secret-jwt-key-change-this-in-production` |
| `PORT` | Server port number | `5000` |
| `NODE_ENV` | Node.js environment | `development` or `production` |

### Optional Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `ALLOWED_ORIGINS` | CORS allowed origins (comma-separated) | `http://localhost:3000,https://realtimecollaborationplatform.vercel.app` |
| `SOCKET_DEBUG` | Enable Socket.IO debugging | `false` |
| `LOG_LEVEL` | Logging level (error, warn, info, debug) | `info` |
| `RATE_LIMIT_MAX` | Maximum requests per minute per IP | `100` |
| `SESSION_TIMEOUT` | Session timeout in milliseconds | `86400000` (24 hours) |
| `DB_CONNECTION_TIMEOUT` | MongoDB connection timeout | `30000` |
| `DB_SOCKET_TIMEOUT` | MongoDB socket timeout | `45000` |
| `ENABLE_SECURITY_HEADERS` | Enable security headers | `true` |
| `API_VERSION` | API version | `v1` |

## Client Environment Variables

### Required Variables

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `REACT_APP_BACKEND_URL` | Backend server URL | `http://localhost:5000` |
| `NODE_ENV` | Node.js environment | `development` or `production` |

### Optional Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `REACT_APP_NAME` | Application name | `RealTimeCollab` |
| `REACT_APP_VERSION` | Application version | `1.0.0` |
| `REACT_APP_API_TIMEOUT` | API request timeout (ms) | `10000` |
| `REACT_APP_SOCKET_TIMEOUT` | Socket.IO timeout (ms) | `20000` |
| `REACT_APP_SOCKET_RETRY_ATTEMPTS` | Socket.IO retry attempts | `3` |
| `REACT_APP_ENABLE_ANALYTICS` | Enable analytics | `false` |
| `REACT_APP_ENABLE_DEBUG` | Enable debug mode | `false` |
| `REACT_APP_THEME` | UI theme | `dark` |
| `REACT_APP_LANGUAGE` | Application language | `en` |
| `REACT_APP_ENABLE_HTTPS` | Enable HTTPS | `false` |
| `REACT_APP_SESSION_TIMEOUT` | Session timeout (ms) | `3600000` (1 hour) |
| `REACT_APP_CACHE_DURATION` | Cache duration (ms) | `300000` (5 minutes) |
| `REACT_APP_MAX_FILE_SIZE` | Maximum file size (bytes) | `10485760` (10MB) |
| `REACT_APP_ENABLE_HOT_RELOAD` | Enable hot reload (dev only) | `true` |
| `REACT_APP_ENABLE_SOURCE_MAPS` | Enable source maps (dev only) | `true` |

## Production Configuration

### Server Production Variables

```env
# Production Server .env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/realtime-collab
JWT_SECRET=your-very-long-and-very-secure-jwt-secret-key-2024-production
PORT=5000
NODE_ENV=production
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
SOCKET_DEBUG=false
LOG_LEVEL=error
RATE_LIMIT_MAX=1000
ENABLE_SECURITY_HEADERS=true
```

### Client Production Variables

```env
# Production Client .env
REACT_APP_BACKEND_URL=https://your-backend-domain.com
NODE_ENV=production
REACT_APP_NAME=RealTimeCollab
REACT_APP_VERSION=1.0.0
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_DEBUG=false
REACT_APP_THEME=dark
REACT_APP_ENABLE_HTTPS=true
```

## Security Considerations

### JWT Secret
- **Never use the default value in production**
- Generate a strong random string (at least 32 characters)
- Use a password manager or secure key generator
- Example: `JWT_SECRET=my-super-secret-jwt-key-2024-production-xyz123-abc456-def789`

### MongoDB URI
- **Never commit database credentials to version control**
- Use environment variables for all database connections
- For production, use MongoDB Atlas or a managed MongoDB service
- Example: `mongodb+srv://username:password@cluster.mongodb.net/realtime-collab`

### CORS Origins
- **Restrict allowed origins in production**
- Only include domains that need access to your API
- Example: `ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com`

## Deployment Platforms

### Vercel (Frontend)
```env
# Vercel Environment Variables
REACT_APP_BACKEND_URL=https://your-backend-domain.com
NODE_ENV=production
```

### Render (Backend)
```env
# Render Environment Variables
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/realtime-collab
JWT_SECRET=your-production-jwt-secret
PORT=5000
NODE_ENV=production
```

### Heroku (Backend)
```env
# Heroku Environment Variables
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/realtime-collab
JWT_SECRET=your-production-jwt-secret
NODE_ENV=production
```

## Troubleshooting

### Common Issues

1. **"JWT_SECRET is not defined"**
   - Make sure you have created a `.env` file in the server directory
   - Ensure the JWT_SECRET variable is set

2. **"MONGO_URI is not defined"**
   - Check that your MongoDB connection string is correct
   - Ensure the database is running and accessible

3. **"REACT_APP_BACKEND_URL is not defined"**
   - Make sure you have created a `.env` file in the client directory
   - Ensure the backend URL is correct and accessible

4. **CORS errors**
   - Check that your backend URL is included in ALLOWED_ORIGINS
   - Ensure the frontend and backend URLs match

### Validation

You can validate your environment variables by running:

```bash
# Server validation
cd server
node -e "require('dotenv').config(); console.log('MONGO_URI:', process.env.MONGO_URI ? 'Set' : 'Missing'); console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Missing');"

# Client validation
cd client
node -e "console.log('REACT_APP_BACKEND_URL:', process.env.REACT_APP_BACKEND_URL ? 'Set' : 'Missing');"
```

## File Structure

```
project/
├── server/
│   ├── .env                    # Server environment variables
│   └── env-config.js           # Environment configuration
├── client/
│   ├── .env                    # Client environment variables
│   └── env-config.js           # Environment configuration
└── ENVIRONMENT_VARIABLES.md    # This documentation
```

## Notes

- All client environment variables must start with `REACT_APP_`
- Never commit `.env` files to version control
- Use `.env.example` files to show the required variables
- Always use strong, unique secrets in production
- Regularly rotate JWT secrets and database passwords 