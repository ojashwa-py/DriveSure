@echo off
echo ==========================================
echo   AutoPulse - Development Startup Script
echo ==========================================

echo.
echo [1/3] Checking MongoDB...
echo NOTE: This script assumes you have MongoDB installed and running on port 27017.
echo If the backend crashes, please ensure MongoDB is running!
echo.

echo [2/3] Starting Backend Server (Port 5000)...
start "AutoPulse Server" cmd /k "cd server && npm run dev"

echo [3/3] Starting Frontend Client (Port 5173)...
start "AutoPulse Client" cmd /k "cd client && npm run dev"

echo.
echo ==========================================
echo   Servers launched!
echo ==========================================
echo.
echo Open your browser to: http://localhost:5173
echo.
echo Test User Credentials:
echo   Email:    john@example.com
echo   Password: password123
echo.
echo If you cannot login, you may need to seed the database:
echo   1. Ensure MongoDB is running
echo   2. cd server
echo   3. npm run seed
echo.
pause
