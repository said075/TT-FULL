import { useState } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch, 
  results = [], 
  onSelect, 
  loading = false,
  className = "" 
}) => {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (value) => {
    setQuery(value);
    setShowResults(value.length > 0);
    onSearch(value);
  };

  const handleSelect = (item) => {
    setQuery('');
    setShowResults(false);
    onSelect(item);
  };

  const clearSearch = () => {
    setQuery('');
    setShowResults(false);
    onSearch('');
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="input-field pl-10 pr-10"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setShowResults(query.length > 0)}
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="py-1">
              {results.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(item)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      {item.code && (
                        <p className="text-sm text-gray-500">Line {item.code}</p>
                      )}
                      {item.lat && item.lng && (
                        <p className="text-xs text-gray-400">
                          {item.lat.toFixed(3)}, {item.lng.toFixed(3)}
                        </p>
                      )}
                    </div>
                    {item.distance && (
                      <span className="text-sm text-gray-500">
                        {Math.round(item.distance)}m
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : query.length > 0 && !loading ? (
            <div className="p-4 text-center text-gray-500">
              No results found for "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
