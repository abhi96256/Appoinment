@echo off
echo Starting Appointment Booking System...

echo.
echo Starting Backend Server...
start "Backend Server" cmd /k "cd /d %~dp0backend && npm run dev"

echo.
echo Waiting 3 seconds...
timeout /t 3 /nobreak > nul

echo.
echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo ========================================
echo   APPOINTMENT BOOKING SYSTEM RUNNING
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
echo Press any key to close this window...
pause > nul
