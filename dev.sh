#!/bin/bash

# Start backend in background
echo "Starting backend..."
cd backend && npm run start:dev &

# Start frontend in background
echo "Starting frontend..."
cd frontend && npm run dev &

# Wait for all background processes
wait 