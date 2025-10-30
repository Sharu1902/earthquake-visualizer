import React, { useState, useEffect, useCallback } from 'react';
import FilterPanel from './components/FilterPanel';
import StatsPanel from './components/StatsPanel';
import EarthquakeGrid from './components/EarthquakeGrid';
import EarthquakeList from './components/EarthquakeList';
import ChartsView from './components/ChartsView';
import './App.css';

function App() {
  const [earthquakes, setEarthquakes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [stats, setStats] = useState(null);
  
  const [filters, setFilters] = useState({
    timeRange: 'day',
    minMagnitude: 3.0,
    maxResults: 50,
    minDepth: 0,
    maxDepth: 1000,
    locationSearch: ''
  });

  const calculateStats = useCallback((eqs, cached) => {
    if (eqs.length === 0) {
      setStats(null);
      return;
    }
    
    const maxMag = Math.max(...eqs.map(eq => eq.magnitude));
    const avgMag = eqs.reduce((sum, eq) => sum + eq.magnitude, 0) / eqs.length;
    const highMag = eqs.filter(eq => eq.magnitude >= 5).length;
    const depthEqs = eqs.filter(eq => eq.depth);
    const avgDepth = depthEqs.length > 0 
      ? depthEqs.reduce((sum, eq) => sum + eq.depth, 0) / depthEqs.length 
      : 0;
    
    setStats({
      total: eqs.length,
      maxMag: maxMag.toFixed(1),
      avgMag: avgMag.toFixed(1),
      avgDepth: avgDepth.toFixed(1),
      highMag,
      cached
    });
  }, []);

  const fetchEarthquakes = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      console.log('Fetching earthquakes via local proxy...');
      
      const response = await fetch('http://localhost:3001', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          min_magnitude: filters.minMagnitude,
          max_results: filters.maxResults * 2,
          time_range: filters.timeRange,
        }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Received', data.total_count, 'earthquakes');
      
      let filtered = data.earthquakes || [];

      filtered = filtered.filter(eq => {
        if (eq.depth !== null && (eq.depth < filters.minDepth || eq.depth > filters.maxDepth)) {
          return false;
        }
        if (filters.locationSearch && !eq.location.toLowerCase().includes(filters.locationSearch.toLowerCase())) {
          return false;
        }
        return true;
      });

      filtered = filtered.slice(0, filters.maxResults);
      
      setEarthquakes(filtered);
      calculateStats(filtered, data.cached);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [filters, calculateStats]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchEarthquakes();
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, fetchEarthquakes]);

  useEffect(() => {
    fetchEarthquakes();
  }, [fetchEarthquakes]);

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>🌍 Earthquake Visualizer Pro</h1>

        <FilterPanel
          {...filters}
          setTimeRange={(val) => setFilters({...filters, timeRange: val})}
          setMinMagnitude={(val) => setFilters({...filters, minMagnitude: val})}
          setMaxResults={(val) => setFilters({...filters, maxResults: val})}
          setMinDepth={(val) => setFilters({...filters, minDepth: val})}
          setMaxDepth={(val) => setFilters({...filters, maxDepth: val})}
          setLocationSearch={(val) => setFilters({...filters, locationSearch: val})}
          onFetch={fetchEarthquakes}
          isLoading={isLoading}
          autoRefresh={autoRefresh}
          setAutoRefresh={setAutoRefresh}
        />

        {error && <div style={styles.error}>❌ {error}</div>}

        <StatsPanel 
          stats={stats} 
          earthquakes={earthquakes}
          filters={filters}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {viewMode === 'charts' && earthquakes.length > 0 && <ChartsView earthquakes={earthquakes} />}
        {viewMode === 'grid' && earthquakes.length > 0 && <EarthquakeGrid earthquakes={earthquakes} />}
        {viewMode === 'list' && earthquakes.length > 0 && <EarthquakeList earthquakes={earthquakes} />}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px', fontFamily: 'Arial, sans-serif' },
  content: { maxWidth: '1400px', margin: '0 auto' },
  title: { color: 'white', textAlign: 'center', marginBottom: '30px', fontSize: '2.5rem', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' },
  error: { background: '#fee', borderLeft: '4px solid #f00', color: '#c00', padding: '15px', borderRadius: '6px', marginBottom: '20px' }
};

export default App;