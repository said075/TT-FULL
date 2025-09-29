# 🚌 Tuzla Transport API

A comprehensive public transport API for Tuzla, providing real-time information about bus lines, stops, timetables, and journey planning.

## ✨ Features

- **Bus Lines Management**: Get all bus lines, search by code/name, and retrieve detailed information
- **Stop Information**: Find stops, search by name, get nearby stops, and view timetables
- **Journey Planning**: Plan routes between stops with direct and connecting options
- **Real-time Data**: Get current timetables and departure information
- **Geographic Search**: Find stops within a specified radius using coordinates
- **RESTful API**: Clean, well-documented REST endpoints
- **PostgreSQL Database**: Robust data storage with proper relationships
- **Docker Support**: Easy deployment with Docker Compose

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Docker and Docker Compose
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TT-backend
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   npm run frontend:install
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Start the database**
   ```bash
   docker-compose up -d
   ```

6. **Run the full application**
   ```bash
   # Development mode (both backend and frontend)
   npm run dev:full
   
   # Or run separately:
   # Backend only
   npm run dev
   
   # Frontend only
   npm run frontend
   ```

### Access Points
- **API**: `http://localhost:3000/api`
- **Frontend**: `http://localhost:5173`
- **API Documentation**: `http://localhost:3000/api`

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Health Check
```http
GET /api/health
```

### Bus Lines

#### Get All Lines
```http
GET /api/lines
```

#### Get Line by ID
```http
GET /api/lines/:id
```

#### Get Line Stops
```http
GET /api/lines/:id/stops?day_type=weekday
```

#### Get Line Timetable
```http
GET /api/lines/:id/timetable?day_type=weekday
```

#### Search Lines
```http
GET /api/lines/search?q=search_term
```

### Stops

#### Get All Stops
```http
GET /api/stops
```

#### Get Stop by ID
```http
GET /api/stops/:id
```

#### Get Stop Timetable
```http
GET /api/stops/:id/timetable?day_type=weekday
```

#### Get Lines Serving a Stop
```http
GET /api/stops/:id/lines
```

#### Search Stops
```http
GET /api/stops/search?q=search_term
```

#### Find Nearby Stops
```http
GET /api/stops/nearby?lat=44.540&lng=18.670&radius=1000
```

### Journey Planning

#### Plan Journey
```http
GET /api/journey/plan?from=1&to=2&day_type=weekday
```

#### Get Nearby Departures
```http
GET /api/journey/nearby?lat=44.540&lng=18.670&radius=500&limit=10
```

## 🗄️ Database Schema

The API uses PostgreSQL with the following main tables:

- **lines**: Bus line information (code, name)
- **stops**: Stop locations with coordinates
- **routes**: Ordered stops for each line
- **timetables**: Departure times for each stop/line combination

## 🛠️ Development

### Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with hot reload
- `npm test` - Run tests (to be implemented)

### Database Management

The database is automatically initialized with schema and seed data when using Docker Compose. The seed data includes sample lines, stops, and timetables for testing.

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 5432 |
| `DB_USER` | Database user | admin |
| `DB_PASSWORD` | Database password | secret |
| `DB_NAME` | Database name | transport |

## 🎨 Frontend Application

A modern React frontend application that provides an intuitive interface for the Tuzla Transport API:

### Frontend Features
- **Modern UI/UX**: Built with React, Vite, and Tailwind CSS
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Real-time Search**: Instant search for lines and stops with debouncing
- **Journey Planning**: Interactive route planning between stops
- **Geographic Features**: Find nearby stops using browser geolocation
- **Progressive Web App**: Fast loading and offline-ready design

### Frontend Pages
- **Home**: Landing page with search and quick actions
- **Lines**: Browse and search bus lines with route details
- **Stops**: Find stops, view timetables, and nearby locations
- **Journey Planner**: Plan routes between any two stops

### Frontend Technology Stack
- **React 18**: Modern React with hooks and functional components
- **Vite**: Lightning-fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **React Router**: Client-side routing for single-page application
- **Axios**: HTTP client for API communication
- **Lucide React**: Beautiful, customizable icons

## 🔧 API Improvements Made

1. **Enhanced Error Handling**: Comprehensive error middleware with proper HTTP status codes
2. **Input Validation**: Parameter validation and sanitization
3. **API Documentation**: Built-in documentation endpoint at `/api`
4. **Health Monitoring**: Health check endpoint for monitoring
5. **Search Functionality**: Search for lines and stops by name/code
6. **Geographic Features**: Find nearby stops using coordinates
7. **Journey Planning**: Route planning between stops
8. **Request Logging**: Detailed request logging for debugging
9. **RESTful Design**: Consistent API structure with proper HTTP methods
10. **Environment Configuration**: Proper environment variable management

## 🚀 Future Enhancements

- Real-time GPS tracking integration
- Push notifications for delays
- User authentication and favorites
- Mobile app integration
- Performance monitoring and analytics
- Rate limiting and security enhancements
- Caching layer for better performance
- WebSocket support for real-time updates

## 📝 License

This project is licensed under the MIT License.
