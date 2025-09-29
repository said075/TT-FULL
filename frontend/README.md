# 🚌 Tuzla Transport Frontend

A modern, responsive React frontend for the Tuzla Transport API, built with Vite, React, and Tailwind CSS.

## ✨ Features

- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Real-time Search**: Instant search for lines and stops
- **Journey Planning**: Interactive route planning between stops
- **Geographic Features**: Find nearby stops using geolocation
- **Mobile Responsive**: Optimized for all device sizes
- **Fast Performance**: Built with Vite for lightning-fast development

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Backend API running on port 3000

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open in browser**
   ```
   http://localhost:5173
   ```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Header.jsx      # Navigation header
│   │   ├── SearchBar.jsx   # Search input component
│   │   ├── LoadingSpinner.jsx
│   │   └── ErrorMessage.jsx
│   ├── pages/              # Main application pages
│   │   ├── Home.jsx        # Landing page
│   │   ├── Lines.jsx       # Bus lines page
│   │   ├── Stops.jsx       # Bus stops page
│   │   └── Journey.jsx     # Journey planner
│   ├── services/           # API integration
│   │   └── api.js          # API service layer
│   ├── hooks/              # Custom React hooks
│   │   └── useAPI.js       # Data fetching hooks
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # App entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── package.json
├── tailwind.config.js      # Tailwind configuration
└── vite.config.js          # Vite configuration
```

## 🎨 UI Components

### Header
- Responsive navigation with mobile menu
- Active route highlighting
- Brand logo and title

### SearchBar
- Real-time search with debouncing
- Dropdown results with selection
- Loading states and error handling

### Cards
- Line cards with route information
- Stop cards with timetable data
- Journey result cards

## 🔌 API Integration

The frontend communicates with the backend API through a centralized service layer:

- **Lines API**: Fetch and search bus lines
- **Stops API**: Find stops and get timetables
- **Journey API**: Plan routes between stops
- **System API**: Health checks and documentation

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch Friendly**: Large touch targets and gestures
- **Progressive Enhancement**: Works on all devices

## 🎯 Key Features

### Home Page
- Hero section with search functionality
- Feature cards with navigation
- Quick action buttons

### Lines Page
- Grid view of all bus lines
- Search and filter functionality
- Expandable route information
- Timetable integration

### Stops Page
- List of all bus stops
- Geolocation-based nearby stops
- Real-time timetable display
- Stop details and lines

### Journey Planner
- Two-stop route planning
- Direct and connecting routes
- Interactive search interface
- Route visualization

## 🚀 Production Build

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Tailwind CSS
Custom configuration in `tailwind.config.js`:
- Custom color palette
- Transport-themed colors
- Inter font family
- Custom component classes

## 📦 Dependencies

### Core
- **React 18**: UI library
- **React Router**: Client-side routing
- **Vite**: Build tool and dev server

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **@tailwindcss/forms**: Form styling

### API & Data
- **Axios**: HTTP client
- **Custom Hooks**: Data fetching and state management

## 🎨 Design System

### Colors
- **Primary**: Blue (#3b82f6)
- **Transport Blue**: #1e40af
- **Transport Green**: #059669
- **Transport Yellow**: #d97706

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Components
- **Buttons**: Primary, secondary, disabled states
- **Cards**: Consistent shadow and border radius
- **Forms**: Styled inputs and selects
- **Loading**: Spinners and skeleton states

## 🔮 Future Enhancements

- **Real-time Updates**: WebSocket integration
- **Offline Support**: Service worker and caching
- **PWA Features**: Installable app
- **Dark Mode**: Theme switching
- **Accessibility**: ARIA labels and keyboard navigation
- **Performance**: Code splitting and lazy loading

## 📝 License

This project is licensed under the MIT License.