import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Lines from './pages/Lines';
import Stops from './pages/Stops';
import Journey from './pages/Journey';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lines" element={<Lines />} />
            <Route path="/stops" element={<Stops />} />
            <Route path="/journey" element={<Journey />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;