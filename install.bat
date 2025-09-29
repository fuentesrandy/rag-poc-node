@echo off

REM Install dependencies for both backend and frontend
echo Installing dependencies for RAG POC Node project...

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install backend dependencies
    exit /b 1
)
cd ..

REM Install frontend dependencies
echo Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install frontend dependencies
    exit /b 1
)
cd ..

echo ✅ All dependencies installed successfully!
echo You can now run the development servers using:
echo   Backend: cd backend ^&^& npm run start:dev
echo   Frontend: cd frontend ^&^& npm run dev
