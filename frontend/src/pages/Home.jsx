import { useState } from "react";
import { Link } from "react-router-dom";
import { Bus, MapPin, Route, Clock, Search, Navigation } from "lucide-react";
import SearchBar from "../components/SearchBar";
import { useSearch } from "../hooks/useAPI";
import { linesAPI, stopsAPI } from "../services/api";

const Home = () => {
  const [searchType, setSearchType] = useState("lines");
  const [selectedItem, setSelectedItem] = useState(null);

  const { results: lineResults, loading: lineLoading } = useSearch(
    linesAPI.search,
    searchType === "lines" ? selectedItem : ""
  );

  const { results: stopResults, loading: stopLoading } = useSearch(
    stopsAPI.search,
    searchType === "stops" ? selectedItem : ""
  );

  const handleSearch = (query) => {
    setSelectedItem(query);
  };

  const handleSelect = (item) => {
    if (searchType === "lines") {
      // Navigate to line details
      window.location.href = `/lines/${item.line_id}`;
    } else {
      // Navigate to stop details
      window.location.href = `/stops/${item.stop_id}`;
    }
  };

  const features = [
    {
      icon: Bus,
      title: "Bus Lines",
      description: "View all available bus lines and their routes",
      link: "/lines",
      color: "bg-blue-500",
    },
    {
      icon: MapPin,
      title: "Stops",
      description: "Find stops near you and view timetables",
      link: "/stops",
      color: "bg-green-500",
    },
    {
      icon: Route,
      title: "Journey Planner",
      description: "Plan your route from one stop to another",
      link: "/journey",
      color: "bg-purple-500",
    },
    {
      icon: Clock,
      title: "Real-time Info",
      description: "Get live departure times and updates",
      link: "/stops",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="bg-blue-600 rounded-2xl p-8 mb-8 shadow-lg">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
                Tuzla Transport
              </h1>
              <p className="text-xl md:text-2xl mb-0 text-white font-medium">
                Your reliable public transport companion
              </p>
            </div>

            {/* Search Section */}
            <div className="max-w-2xl mx-auto bg-white rounded-xl p-6 shadow-lg">
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => setSearchType("lines")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    searchType === "lines"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-blue-600 hover:text-white"
                  }`}
                >
                  <Bus className="h-4 w-4 inline mr-2" />
                  Lines
                </button>
                <button
                  onClick={() => setSearchType("stops")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    searchType === "stops"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-blue-600 hover:text-white"
                  }`}
                >
                  <MapPin className="h-4 w-4 inline mr-2" />
                  Stops
                </button>
              </div>

              <SearchBar
                placeholder={`Search ${searchType}...`}
                onSearch={handleSearch}
                results={searchType === "lines" ? lineResults : stopResults}
                onSelect={handleSelect}
                loading={searchType === "lines" ? lineLoading : stopLoading}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything you need for your journey
          </h2>
          <p className="text-lg text-gray-600">
            Plan, track, and navigate Tuzla's public transport system
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.link}
              className="group card hover:shadow-lg transition-shadow duration-200"
            >
              <div
                className={`${feature.color} text-white p-3 rounded-lg w-fit mb-4`}
              >
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/lines"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
            >
              <Bus className="h-8 w-8 text-blue-600 mr-4" />
              <div>
                <h4 className="font-semibold text-gray-900">View All Lines</h4>
                <p className="text-sm text-gray-600">
                  Browse available bus routes
                </p>
              </div>
            </Link>

            <Link
              to="/stops"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
            >
              <MapPin className="h-8 w-8 text-blue-600 mr-4" />
              <div>
                <h4 className="font-semibold text-gray-900">Find Stops</h4>
                <p className="text-sm text-gray-600">
                  Search for stops near you
                </p>
              </div>
            </Link>

            <Link
              to="/journey"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
            >
              <Navigation className="h-8 w-8 text-blue-600 mr-4" />
              <div>
                <h4 className="font-semibold text-gray-900">Plan Journey</h4>
                <p className="text-sm text-gray-600">
                  Get route recommendations
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
