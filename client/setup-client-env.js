#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Client Environment Setup');
console.log('============================\n');

// Development environment variables
const devEnvContent = `# Client Environment Variables
# =============================

# Backend URL - Update this with your actual backend URL
# For development: http://localhost:5000
# For production: https://your-backend-domain.com
REACT_APP_BACKEND_URL=http://localhost:5000

# Node Environment
# development or production
NODE_ENV=development
`;

// Production environment variables
const prodEnvContent = `# Client Environment Variables (Production)
# ======================================

# Backend URL - Your deployed backend URL
REACT_APP_BACKEND_URL=https://your-backend-domain.com

# Node Environment
NODE_ENV=production
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
    console.log('📦 Setting up PRODUCTION client environment...\n');
    
    createEnvFile(
      path.join(__dirname, '.env'),
      prodEnvContent,
      'client/.env (production)'
    );
    
    console.log('\n🔒 IMPORTANT PRODUCTION NOTES:');
    console.log('1. Update REACT_APP_BACKEND_URL with your actual backend domain');
    console.log('2. Make sure your backend is deployed and accessible');
    console.log('3. For Vercel deployment, add these variables in Vercel dashboard');
    
  } else {
    console.log('🛠️  Setting up DEVELOPMENT client environment...\n');
    
    createEnvFile(
      path.join(__dirname, '.env'),
      devEnvContent,
      'client/.env (development)'
    );
    
    console.log('\n🚀 Development setup complete!');
    console.log('You can now start the client:');
    console.log('npm start');
  }
  
  console.log('\n📋 Required Environment Variables:');
  console.log('- REACT_APP_BACKEND_URL: Your backend server URL');
  console.log('- NODE_ENV: development or production');
}

// Show help if requested
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Usage: node setup-client-env.js [options]

Options:
  --development, -d    Setup development environment (default)
  --production, -p     Setup production environment
  --help, -h          Show this help message

Examples:
  node setup-client-env.js              # Setup development environment
  node setup-client-env.js --production # Setup production environment
  node setup-client-env.js -p           # Setup production environment
`);
  process.exit(0);
}

main(); 