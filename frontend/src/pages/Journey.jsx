import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Route, MapPin, Clock, Bus, Navigation, ArrowRight } from 'lucide-react';
import { useAPI } from '../hooks/useAPI';
import { journeyAPI, stopsAPI } from '../services/api';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Journey = () => {
  const [fromStop, setFromStop] = useState(null);
  const [toStop, setToStop] = useState(null);
  const [dayType, setDayType] = useState('weekday');
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');
  const [planning, setPlanning] = useState(false);
  const [journeyResult, setJourneyResult] = useState(null);

  const { results: fromResults, loading: fromLoading } = useSearch(
    stopsAPI.search,
    searchFrom
  );

  const { results: toResults, loading: toLoading } = useSearch(
    stopsAPI.search,
    searchTo
  );

  const handleFromSelect = (stop) => {
    setFromStop(stop);
    setSearchFrom('');
  };

  const handleToSelect = (stop) => {
    setToStop(stop);
    setSearchTo('');
  };

  const planJourney = async () => {
    if (!fromStop || !toStop) return;

    setPlanning(true);
    try {
      const response = await journeyAPI.plan(fromStop.stop_id, toStop.stop_id, dayType);
      setJourneyResult(response.data);
    } catch (error) {
      console.error('Error planning journey:', error);
      alert('Failed to plan journey. Please try again.');
    } finally {
      setPlanning(false);
    }
  };

  const clearJourney = () => {
    setFromStop(null);
    setToStop(null);
    setJourneyResult(null);
    setSearchFrom('');
    setSearchTo('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Journey Planner</h1>
          <p className="text-lg text-gray-600">
            Plan your route from one stop to another
          </p>
        </div>

        {/* Journey Planning Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="space-y-6">
            {/* From Stop */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Stop
              </label>
              {fromStop ? (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{fromStop.name}</p>
                      <p className="text-sm text-gray-500">Stop ID: {fromStop.stop_id}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setFromStop(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <SearchBar
                  placeholder="Search for departure stop..."
                  onSearch={setSearchFrom}
                  results={fromResults}
                  onSelect={handleFromSelect}
                  loading={fromLoading}
                />
              )}
            </div>

            {/* To Stop */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Stop
              </label>
              {toStop ? (
                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{toStop.name}</p>
                      <p className="text-sm text-gray-500">Stop ID: {toStop.stop_id}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setToStop(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <SearchBar
                  placeholder="Search for destination stop..."
                  onSearch={setSearchTo}
                  results={toResults}
                  onSelect={handleToSelect}
                  loading={toLoading}
                />
              )}
            </div>

            {/* Day Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schedule Type
              </label>
              <select
                value={dayType}
                onChange={(e) => setDayType(e.target.value)}
                className="input-field w-full"
              >
                <option value="weekday">Weekday</option>
                <option value="weekend">Weekend</option>
                <option value="holiday">Holiday</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={planJourney}
                disabled={!fromStop || !toStop || planning}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {planning ? (
                  <LoadingSpinner size="sm" text="Planning..." />
                ) : (
                  <>
                    <Route className="h-4 w-4 mr-2" />
                    Plan Journey
                  </>
                )}
              </button>
              <button
                onClick={clearJourney}
                className="btn-secondary"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Journey Results */}
        {journeyResult && (
          <JourneyResults 
            result={journeyResult} 
            fromStop={fromStop}
            toStop={toStop}
            dayType={dayType}
          />
        )}

        {/* Quick Actions */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/stops"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
            >
              <MapPin className="h-8 w-8 text-blue-600 mr-4" />
              <div>
                <h4 className="font-semibold text-gray-900">Browse Stops</h4>
                <p className="text-sm text-gray-600">Find stops near you</p>
              </div>
            </Link>
            
            <Link
              to="/lines"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
            >
              <Bus className="h-8 w-8 text-blue-600 mr-4" />
              <div>
                <h4 className="font-semibold text-gray-900">View Lines</h4>
                <p className="text-sm text-gray-600">Explore all bus routes</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const JourneyResults = ({ result, fromStop, toStop, dayType }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Journey Options</h3>
        <div className="text-sm text-gray-500">
          {result.total_options} option{result.total_options !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Journey Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-green-600 mr-2" />
            <span className="font-medium">{fromStop.name}</span>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400 mx-4" />
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-blue-600 mr-2" />
            <span className="font-medium">{toStop.name}</span>
          </div>
        </div>
      </div>

      {/* Direct Routes */}
      {result.direct_routes && result.direct_routes.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Bus className="h-5 w-5 mr-2 text-green-600" />
            Direct Routes
          </h4>
          <div className="space-y-3">
            {result.direct_routes.map((route, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="bg-transport-blue text-white px-3 py-1 rounded-full text-sm font-medium mr-3">
                      Line {route.code}
                    </div>
                    <span className="font-medium text-gray-900">{route.line_name}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {route.from_sequence} → {route.to_sequence} stops
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {route.from_stop} → {route.to_stop}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Connecting Routes */}
      {result.connecting_routes && result.connecting_routes.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Route className="h-5 w-5 mr-2 text-orange-600" />
            Connecting Routes
          </h4>
          <div className="space-y-3">
            {result.connecting_routes.map((route, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="bg-transport-blue text-white px-3 py-1 rounded-full text-sm font-medium">
                      Line {route.line1_code}
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                    <div className="bg-transport-green text-white px-3 py-1 rounded-full text-sm font-medium">
                      Line {route.line2_code}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {route.from_stop} → {route.transfer_stop} → {route.to_stop}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Transfer at: {route.transfer_stop}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Routes Found */}
      {result.total_options === 0 && (
        <div className="text-center py-8">
          <Route className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Routes Found</h4>
          <p className="text-gray-600">
            We couldn't find any routes between these stops. Try selecting different stops.
          </p>
        </div>
      )}
    </div>
  );
};

export default Journey;
