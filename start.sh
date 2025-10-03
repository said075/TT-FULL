#!/bin/bash

# Tuzla Transport API - Startup Script
# This script starts the database, backend, and frontend services

set -e  # Exit on any error

echo "🚌 Starting Tuzla Transport API..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if required commands exist
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "All dependencies are available"
}

# Check if .env file exists
check_env_file() {
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating default .env file..."
        cat > .env << EOF
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=secret
DB_NAME=transport
EOF
        print_success "Created .env file with default values"
    else
        print_success ".env file exists"
    fi
}

# Install dependencies if needed
install_dependencies() {
    print_status "Checking backend dependencies..."
    if [ ! -d "node_modules" ]; then
        print_status "Installing backend dependencies..."
        npm install
        print_success "Backend dependencies installed"
    else
        print_success "Backend dependencies already installed"
    fi
    
    print_status "Checking frontend dependencies..."
    if [ ! -d "frontend/node_modules" ]; then
        print_status "Installing frontend dependencies..."
        cd frontend && npm install && cd ..
        print_success "Frontend dependencies installed"
    else
        print_success "Frontend dependencies already installed"
    fi
}

# Start database
start_database() {
    print_status "Starting PostgreSQL database..."
    docker-compose up -d
    
    # Wait for database to be ready
    print_status "Waiting for database to be ready..."
    sleep 5
    
    # Check if database is responding
    max_attempts=30
    attempt=1
    while [ $attempt -le $max_attempts ]; do
        if docker exec tuzla-transport-db pg_isready -U admin -d transport &> /dev/null; then
            print_success "Database is ready!"
            break
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            print_error "Database failed to start after $max_attempts attempts"
            exit 1
        fi
        
        print_status "Waiting for database... (attempt $attempt/$max_attempts)"
        sleep 2
        ((attempt++))
    done
}

# Function to cleanup on exit
cleanup() {
    print_status "Shutting down services..."
    # Kill background processes
    jobs -p | xargs -r kill
    print_success "Services stopped"
}

# Set trap to cleanup on script exit
trap cleanup EXIT INT TERM

# Main execution
main() {
    check_dependencies
    check_env_file
    install_dependencies
    start_database
    
    print_success "All services are starting up!"
    echo ""
    echo "🌐 Access Points:"
    echo "  • API:          http://localhost:3000/api"
    echo "  • Frontend:     http://localhost:5173"
    echo "  • API Docs:     http://localhost:3000/api"
    echo ""
    echo "📝 Logs will appear below. Press Ctrl+C to stop all services."
    echo "================================================================"
    echo ""
    
    # Start both backend and frontend in parallel
    npm run dev:full
}

# Run main function
main
