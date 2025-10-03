import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bus, Clock, MapPin, Search } from 'lucide-react';
import { useAPI, useSearch } from '../hooks/useAPI';
import { linesAPI } from '../services/api';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Lines = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dayType, setDayType] = useState('weekday');
  
  const { data: lines, loading, error, refetch } = useAPI(() => linesAPI.getAll());
  const { results: searchResults, loading: searchLoading } = useSearch(
    linesAPI.search,
    searchQuery
  );

  const displayLines = searchQuery ? searchResults : lines || [];

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSelect = (line) => {
    setSearchQuery('');
    // Navigate to line details
    window.location.href = `/lines/${line.line_id}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading bus lines..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Bus Lines</h1>
          <p className="text-lg text-gray-600">
            Explore all available bus routes in Tuzla
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Search bus lines..."
                onSearch={handleSearch}
                results={searchResults}
                onSelect={handleSelect}
                loading={searchLoading}
              />
            </div>
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Schedule:</label>
              <select
                value={dayType}
                onChange={(e) => setDayType(e.target.value)}
                className="input-field w-auto"
              >
                <option value="weekday">Weekday</option>
                <option value="weekend">Weekend</option>
                <option value="holiday">Holiday</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lines Grid */}
        {displayLines.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayLines.map((line) => (
              <LineCard key={line.line_id} line={line} dayType={dayType} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Bus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No lines found' : 'No lines available'}
            </h3>
            <p className="text-gray-600">
              {searchQuery 
                ? `No bus lines match "${searchQuery}"`
                : 'There are currently no bus lines in the system'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const LineCard = ({ line, dayType }) => {
  const [stops, setStops] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const loadStops = async () => {
    if (stops) return;
    
    setLoading(true);
    try {
      const response = await linesAPI.getStops(line.line_id, dayType);
      setStops(response.data);
    } catch (error) {
      console.error('Error loading stops:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    setExpanded(!expanded);
    if (!stops) {
      loadStops();
    }
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-transport-blue text-white p-2 rounded-lg">
            <Bus className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Line {line.code}</h3>
            <p className="text-gray-600">{line.name}</p>
          </div>
        </div>
        <button
          onClick={handleToggle}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          {expanded ? 'Hide' : 'View'} Route
        </button>
      </div>

      {expanded && (
        <div className="border-t border-gray-200 pt-4">
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <LoadingSpinner size="sm" text="Loading stops..." />
            </div>
          ) : stops ? (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 mb-2">Route Stops:</h4>
              <div className="space-y-1">
                {stops.map((stop, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <div className="w-4 h-4 bg-blue-600 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700">{stop.name}</span>
                    {stop.departure_time && (
                      <span className="text-gray-500 ml-auto">
                        {stop.departure_time}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No stops available</p>
          )}
        </div>
      )}

      <div className="flex space-x-2 mt-4">
        <Link
          to={`/lines/${line.line_id}`}
          className="flex-1 btn-primary text-center"
        >
          View Details
        </Link>
        <Link
          to={`/lines/${line.line_id}/timetable?day_type=${dayType}`}
          className="flex-1 btn-secondary text-center"
        >
          <Clock className="h-4 w-4 inline mr-1" />
          Timetable
        </Link>
      </div>
    </div>
  );
};

export default Lines;
