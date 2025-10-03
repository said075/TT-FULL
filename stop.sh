#!/bin/bash

# Tuzla Transport API - Stop Script
# This script stops all services

echo "🛑 Stopping Tuzla Transport API services..."

# Stop Docker containers
echo "Stopping database..."
docker-compose down

# Kill any remaining Node processes (optional, be careful with this)
echo "Stopping any remaining processes..."
pkill -f "node.*src/index.js" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

echo "✅ All services stopped!"
