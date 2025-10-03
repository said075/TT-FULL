#!/bin/bash

# Tuzla Transport API - Docker Production Startup
# This script builds and starts all services using Docker

set -e

echo "🐳 Starting Tuzla Transport API with Docker..."
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
    print_success "Docker is running"
}

# Build and start services
start_services() {
    print_status "Building and starting all services..."
    
    # Build images and start services
    docker-compose up --build -d
    
    print_status "Services are starting in the background..."
    
    # Brief wait for containers to initialize
    sleep 10
    
    print_success "Services have been started!"
}

# Show service status
show_status() {
    echo ""
    print_success "🚀 Tuzla Transport API is running!"
    echo ""
    echo "🌐 Access Points:"
    echo "  • Frontend:     http://localhost"
    echo "  • API:          http://localhost/api"
    echo "  • API Direct:   http://localhost:3000/api"
    echo "  • Database:     localhost:5432"
    echo ""
    echo "📊 Service Status:"
    docker-compose ps
    echo ""
    echo "📝 To view logs: docker-compose logs -f [service_name]"
    echo "🛑 To stop: docker-compose down"
    echo "🔄 To restart: docker-compose restart [service_name]"
}

# Cleanup function
cleanup() {
    print_status "Cleaning up..."
}

trap cleanup EXIT

# Main execution
main() {
    check_docker
    start_services
    show_status
}

main
