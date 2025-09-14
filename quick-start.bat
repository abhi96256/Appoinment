@echo off
echo ========================================
echo   APPOINTMENT BOOKING SYSTEM
echo ========================================
echo.

echo Installing SQLite dependency...
cd backend
npm install sqlite3
echo.

echo Starting Backend Server...
start "Backend" cmd /k "npm run dev"

echo.
echo Waiting 3 seconds...
timeout /t 3 /nobreak > nul

echo.
echo Starting Frontend Server...
cd ..
start "Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo   SYSTEM IS NOW RUNNING!
echo ========================================
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo Admin:    http://localhost:5173/admin/login
echo.
echo Default Admin Login:
echo Email:    admin@example.com
echo Password: admin123
echo.
echo Press any key to close...
pause > nul
