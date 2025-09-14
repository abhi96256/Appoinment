@echo off
echo Starting Appointment Booking System...

echo Starting Backend Server...
start "Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Frontend" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Frontend: http://localhost:5173
echo Backend: http://localhost:5000
echo Admin Login: http://localhost:5173/admin/login
echo.
echo Press any key to exit...
pause > nul
