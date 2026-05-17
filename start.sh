#!/bin/bash
# Start Poppy Career Counselor
ollama serve &
sleep 2
cd backend && python main.py &
cd frontend && npm run dev &
wait
