#!/bin/bash

# Tuzla Transport API - Docker Stop Script
# This script stops all Docker services

echo "🐳 Stopping Tuzla Transport API Docker services..."
echo "=================================================="

# Stop and remove containers
echo "Stopping containers..."
docker-compose down

# Optional: Remove images (uncomment if you want to clean up images)
# echo "Removing images..."
# docker-compose down --rmi all

# Optional: Remove volumes (uncomment if you want to clean up data - BE CAREFUL!)
# echo "Removing volumes..."
# docker-compose down -v

echo "✅ All Docker services stopped!"
echo ""
echo "💡 Available options:"
echo "  • Restart: ./docker-start.sh"
echo "  • Remove everything: docker-compose down -v --rmi all"
echo "  • View logs: docker-compose logs [service_name]"
