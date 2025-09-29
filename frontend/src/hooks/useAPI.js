import { useState, useEffect } from 'react';

export const useAPI = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiCall();
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: () => fetchData() };
};

export const useSearch = (searchAPI, query, minLength = 2) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query || query.length < minLength) {
      setResults([]);
      return;
    }

    const search = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await searchAPI(query);
        setResults(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Search failed');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(search, 300); // Debounce search
    return () => clearTimeout(timeoutId);
  }, [query, searchAPI, minLength]);

  return { results, loading, error };
};
