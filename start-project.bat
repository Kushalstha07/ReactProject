@echo off
echo Starting CottonCo E-commerce Project...
echo.

echo Step 1: Starting Backend Server...
cd backend
start "Backend Server" cmd /k "npm run dev"

echo Step 2: Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Step 3: Starting Frontend Server...
cd ..\frotend
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Backend will be available at: http://localhost:3000
echo Frontend will be available at: http://localhost:5173
echo.
echo Default Admin Credentials:
echo Email: admin@cottonco.com
echo Password: admin123
echo.
pause 