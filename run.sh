#!/bin/bash

# Run frontend and backend concurrently
pkill -f "spring-boot:run"

# Start backend
cd backend
mvn spring-boot:run &
BACKEND_PID=$!

# Start frontend
cd ../frontend
npm run dev &
FRONTEND_PID=$!

# Wait for both processes to finish
wait $BACKEND_PID $FRONTEND_PID
