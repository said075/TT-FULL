#!/bin/bash

# Quick Docker startup without complex health checks

echo "🐳 Quick Docker startup for Tuzla Transport API..."
echo "================================================="

# Stop any existing containers
docker-compose down

# Start services
echo "Starting services..."
docker-compose up --build -d

# Simple wait
echo "Waiting 30 seconds for services to start..."
sleep 30

echo ""
echo "🚀 Services should be starting up!"
echo ""
echo "🌐 Access Points:"
echo "  • Frontend:     http://localhost"
echo "  • API:          http://localhost/api"
echo "  • API Direct:   http://localhost:3000/api"
echo ""
echo "📊 Service Status:"
docker-compose ps
echo ""
echo "📝 Check logs: docker-compose logs -f [service_name]"
echo "🛑 Stop: docker-compose down"
