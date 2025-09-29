#!/bin/bash

# Install dependencies for both backend and frontend
echo "Installing dependencies for RAG POC Node project..."

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "Error: Failed to install backend dependencies"
    exit 1
fi
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "Error: Failed to install frontend dependencies"
    exit 1
fi
cd ..

echo "✅ All dependencies installed successfully!"
echo "You can now run the development servers using:"
echo "  Backend: cd backend && npm run start:dev"
echo "  Frontend: cd frontend && npm run dev"
