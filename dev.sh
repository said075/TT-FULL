#!/bin/bash

# Quick development startup - assumes everything is already set up

echo "🚀 Quick start - Tuzla Transport API"
echo "===================================="

# Start database if not running
if ! docker ps | grep -q tuzla-transport-db; then
    echo "Starting database..."
    docker-compose up -d
    sleep 3
fi

echo "Starting backend and frontend..."
echo ""
echo "🌐 Access Points:"
echo "  • API:          http://localhost:3000/api"
echo "  • Frontend:     http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services."
echo "=================================="

# Start both services
npm run dev:full
