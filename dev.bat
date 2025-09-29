@echo off

REM Start backend in background
echo Starting backend...
start /b cmd /c "cd backend && npm run start:dev"

REM Start frontend in background
echo Starting frontend...
start /b cmd /c "cd frontend && npm run dev"

echo Both services are starting...
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:3001 (or the port configured in your backend)
echo.
echo Press any key to stop all services...
pause >nul

REM Kill all Node.js processes
taskkill /f /im node.exe
