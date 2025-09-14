@echo off
cd backend
echo JWT_SECRET=your_super_secret_jwt_key_here_12345 > .env
echo ADMIN_EMAIL=admin@example.com >> .env
echo ADMIN_PASSWORD=admin123 >> .env
echo PORT=5000 >> .env
echo NODE_ENV=development >> .env
echo .env file created!
echo Starting servers...
start "Backend" cmd /k "npm run dev"
cd ..
timeout /t 2 /nobreak > nul
start "Frontend" cmd /k "npm run dev"
echo Done! Check http://localhost:5173
