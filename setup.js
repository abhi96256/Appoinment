#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Appointment Booking System...\n');

// Check if Node.js version is compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 16) {
  console.error('❌ Node.js version 16 or higher is required');
  process.exit(1);
}

console.log('✅ Node.js version check passed');

// Create .env files if they don't exist
const frontendEnvPath = '.env';
const backendEnvPath = 'backend/.env';

if (!fs.existsSync(frontendEnvPath)) {
  fs.copyFileSync('env.example', frontendEnvPath);
  console.log('✅ Created frontend .env file');
}

if (!fs.existsSync(backendEnvPath)) {
  fs.copyFileSync('backend/env.example', backendEnvPath);
  console.log('✅ Created backend .env file');
}

// Install dependencies
console.log('\n📦 Installing dependencies...');

try {
  console.log('Installing frontend dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('Installing backend dependencies...');
  execSync('cd backend && npm install', { stdio: 'inherit' });
  
  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

console.log('\n🎉 Setup completed successfully!');
console.log('\nNext steps:');
console.log('1. Update backend/.env with your database credentials');
console.log('2. Create MySQL database: appointment_db');
console.log('3. Run: cd backend && npx sequelize-cli db:migrate');
console.log('4. Run: cd backend && npx sequelize-cli db:seed:all');
console.log('5. Start development servers:');
console.log('   - Backend: npm run backend');
console.log('   - Frontend: npm run dev');
console.log('\n🌐 Access the app at http://localhost:5173');
console.log('🔐 Admin login: http://localhost:5173/admin/login');
