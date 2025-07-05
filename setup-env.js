#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 RealTimeCollab Environment Setup');
console.log('=====================================\n');

// Server environment variables
const serverEnvContent = `# Server Environment Variables
# =============================

# Required Variables
MONGO_URI=mongodb://localhost:27017/realtime-collab
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development

# Optional Variables
ALLOWED_ORIGINS=http://localhost:3000,https://realtimecollaborationplatform.vercel.app
SOCKET_DEBUG=false
LOG_LEVEL=info
RATE_LIMIT_MAX=100
SESSION_TIMEOUT=86400000
DB_CONNECTION_TIMEOUT=30000
DB_SOCKET_TIMEOUT=45000
ENABLE_SECURITY_HEADERS=true
API_VERSION=v1
`;

// Client environment variables
const clientEnvContent = `# Client Environment Variables
# =============================

# Required Variables
REACT_APP_BACKEND_URL=http://localhost:5000
NODE_ENV=development

# Optional Variables
REACT_APP_NAME=RealTimeCollab
REACT_APP_VERSION=1.0.0
REACT_APP_API_TIMEOUT=10000
REACT_APP_SOCKET_TIMEOUT=20000
REACT_APP_SOCKET_RETRY_ATTEMPTS=3
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_ENABLE_DEBUG=false
REACT_APP_THEME=dark
REACT_APP_LANGUAGE=en
REACT_APP_ENABLE_HTTPS=false
REACT_APP_SESSION_TIMEOUT=3600000
REACT_APP_CACHE_DURATION=300000
REACT_APP_MAX_FILE_SIZE=10485760
REACT_APP_ENABLE_HOT_RELOAD=true
REACT_APP_ENABLE_SOURCE_MAPS=true
`;

// Production server environment variables
const serverProdEnvContent = `# Production Server Environment Variables
# ======================================

# Required Variables
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/realtime-collab
JWT_SECRET=your-very-long-and-very-secure-jwt-secret-key-2024-production
PORT=5000
NODE_ENV=production

# Optional Variables
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
SOCKET_DEBUG=false
LOG_LEVEL=error
RATE_LIMIT_MAX=1000
SESSION_TIMEOUT=86400000
DB_CONNECTION_TIMEOUT=30000
DB_SOCKET_TIMEOUT=45000
ENABLE_SECURITY_HEADERS=true
API_VERSION=v1
`;

// Production client environment variables
const clientProdEnvContent = `# Production Client Environment Variables
# ======================================

# Required Variables
REACT_APP_BACKEND_URL=https://your-backend-domain.com
NODE_ENV=production

# Optional Variables
REACT_APP_NAME=RealTimeCollab
REACT_APP_VERSION=1.0.0
REACT_APP_API_TIMEOUT=10000
REACT_APP_SOCKET_TIMEOUT=20000
REACT_APP_SOCKET_RETRY_ATTEMPTS=3
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_DEBUG=false
REACT_APP_THEME=dark
REACT_APP_LANGUAGE=en
REACT_APP_ENABLE_HTTPS=true
REACT_APP_SESSION_TIMEOUT=3600000
REACT_APP_CACHE_DURATION=300000
REACT_APP_MAX_FILE_SIZE=10485760
REACT_APP_ENABLE_HOT_RELOAD=false
REACT_APP_ENABLE_SOURCE_MAPS=false
`;

function createEnvFile(filePath, content, description) {
  try {
    if (fs.existsSync(filePath)) {
      console.log(`⚠️  ${description} already exists. Skipping...`);
      return false;
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Created ${description}`);
    return true;
  } catch (error) {
    console.error(`❌ Error creating ${description}:`, error.message);
    return false;
  }
}

function main() {
  const args = process.argv.slice(2);
  const isProduction = args.includes('--production') || args.includes('-p');
  
  if (isProduction) {
    console.log('📦 Setting up PRODUCTION environment variables...\n');
    
    createEnvFile(
      path.join(__dirname, 'server', '.env'),
      serverProdEnvContent,
      'server/.env (production)'
    );
    
    createEnvFile(
      path.join(__dirname, 'client', '.env'),
      clientProdEnvContent,
      'client/.env (production)'
    );
    
    console.log('\n🔒 IMPORTANT PRODUCTION NOTES:');
    console.log('1. Update MONGO_URI with your actual MongoDB connection string');
    console.log('2. Generate a strong JWT_SECRET (at least 32 characters)');
    console.log('3. Update REACT_APP_BACKEND_URL with your backend domain');
    console.log('4. Update ALLOWED_ORIGINS with your actual domains');
    console.log('5. Never commit .env files to version control');
    
  } else {
    console.log('🛠️  Setting up DEVELOPMENT environment variables...\n');
    
    createEnvFile(
      path.join(__dirname, 'server', '.env'),
      serverEnvContent,
      'server/.env (development)'
    );
    
    createEnvFile(
      path.join(__dirname, 'client', '.env'),
      clientEnvContent,
      'client/.env (development)'
    );
    
    console.log('\n🚀 Development setup complete!');
    console.log('You can now start the application:');
    console.log('1. Start MongoDB: mongod');
    console.log('2. Start server: cd server && npm start');
    console.log('3. Start client: cd client && npm start');
  }
  
  console.log('\n📚 For more information, see ENVIRONMENT_VARIABLES.md');
}

// Show help if requested
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Usage: node setup-env.js [options]

Options:
  --development, -d    Setup development environment (default)
  --production, -p     Setup production environment
  --help, -h          Show this help message

Examples:
  node setup-env.js              # Setup development environment
  node setup-env.js --production # Setup production environment
  node setup-env.js -p           # Setup production environment
`);
  process.exit(0);
}

main(); 