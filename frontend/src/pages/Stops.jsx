import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Bus, Navigation, Search } from 'lucide-react';
import { useAPI, useSearch } from '../hooks/useAPI';
import { stopsAPI } from '../services/api';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Stops = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dayType, setDayType] = useState('weekday');
  const [showNearby, setShowNearby] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  
  const { data: stops, loading, error, refetch } = useAPI(() => stopsAPI.getAll());
  const { results: searchResults, loading: searchLoading } = useSearch(
    stopsAPI.search,
    searchQuery
  );

  const displayStops = searchQuery ? searchResults : stops || [];

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSelect = (stop) => {
    setSearchQuery('');
    // Navigate to stop details
    window.location.href = `/stops/${stop.stop_id}`;
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setShowNearby(true);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading stops..." />
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Bus Stops</h1>
          <p className="text-lg text-gray-600">
            Find stops near you and view departure times
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Search stops..."
                onSearch={handleSearch}
                results={searchResults}
                onSelect={handleSelect}
                loading={searchLoading}
              />
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={getCurrentLocation}
                className="btn-secondary flex items-center"
              >
                <Navigation className="h-4 w-4 mr-2" />
                Find Nearby
              </button>
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

        {/* Nearby Stops */}
        {showNearby && userLocation && (
          <NearbyStops 
            lat={userLocation.lat} 
            lng={userLocation.lng} 
            dayType={dayType}
            onClose={() => setShowNearby(false)}
          />
        )}

        {/* Stops Grid */}
        {displayStops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayStops.map((stop) => (
              <StopCard key={stop.stop_id} stop={stop} dayType={dayType} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No stops found' : 'No stops available'}
            </h3>
            <p className="text-gray-600">
              {searchQuery 
                ? `No stops match "${searchQuery}"`
                : 'There are currently no stops in the system'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const StopCard = ({ stop, dayType }) => {
  const [timetable, setTimetable] = useState(null);
  const [lines, setLines] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const loadDetails = async () => {
    if (timetable && lines) return;
    
    setLoading(true);
    try {
      const [timetableRes, linesRes] = await Promise.all([
        stopsAPI.getTimetable(stop.stop_id, dayType),
        stopsAPI.getLines(stop.stop_id)
      ]);
      setTimetable(timetableRes.data);
      setLines(linesRes.data);
    } catch (error) {
      console.error('Error loading stop details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    setExpanded(!expanded);
    if (!timetable || !lines) {
      loadDetails();
    }
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-transport-green text-white p-2 rounded-lg">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{stop.name}</h3>
            {stop.lat && stop.lng && (
              <p className="text-sm text-gray-500">
                {stop.lat.toFixed(4)}, {stop.lng.toFixed(4)}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={handleToggle}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          {expanded ? 'Hide' : 'View'} Details
        </button>
      </div>

      {expanded && (
        <div className="border-t border-gray-200 pt-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <LoadingSpinner size="sm" text="Loading details..." />
            </div>
          ) : (
            <>
              {/* Lines */}
              {lines && lines.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Bus className="h-4 w-4 mr-1" />
                    Lines ({lines.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {lines.map((line, index) => (
                      <span
                        key={index}
                        className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-sm"
                      >
                        {line.code}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Timetable */}
              {timetable && timetable.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Next Departures
                  </h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {timetable.slice(0, 5).map((departure, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-700">
                          Line {departure.line_code}
                        </span>
                        <span className="text-gray-500 font-mono">
                          {departure.departure_time}
                        </span>
                      </div>
                    ))}
                    {timetable.length > 5 && (
                      <p className="text-xs text-gray-500">
                        +{timetable.length - 5} more departures
                      </p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <div className="flex space-x-2 mt-4">
        <Link
          to={`/stops/${stop.stop_id}`}
          className="flex-1 btn-primary text-center"
        >
          View Details
        </Link>
        <Link
          to={`/stops/${stop.stop_id}/timetable?day_type=${dayType}`}
          className="flex-1 btn-secondary text-center"
        >
          <Clock className="h-4 w-4 inline mr-1" />
          Timetable
        </Link>
      </div>
    </div>
  );
};

const NearbyStops = ({ lat, lng, dayType, onClose }) => {
  const { data: nearbyStops, loading, error } = useAPI(() => 
    stopsAPI.getNearby(lat, lng, 1000)
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Navigation className="h-5 w-5 mr-2 text-primary-600" />
          Stops Near You
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>

      {loading ? (
        <LoadingSpinner size="sm" text="Finding nearby stops..." />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : nearbyStops && nearbyStops.length > 0 ? (
        <div className="space-y-3">
          {nearbyStops.map((stop, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{stop.name}</h4>
                <p className="text-sm text-gray-500">
                  {Math.round(stop.distance)}m away
                </p>
              </div>
              <Link
                to={`/stops/${stop.stop_id}`}
                className="btn-primary text-sm"
              >
                View
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No stops found within 1km</p>
      )}
    </div>
  );
};

export default Stops;
