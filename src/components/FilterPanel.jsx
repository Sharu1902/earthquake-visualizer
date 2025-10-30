import React from 'react';

const FilterPanel = ({
  timeRange, setTimeRange,
  minMagnitude, setMinMagnitude,
  maxResults, setMaxResults,
  minDepth, setMinDepth,
  maxDepth, setMaxDepth,
  locationSearch, setLocationSearch,
  onFetch, isLoading,
  autoRefresh, setAutoRefresh
}) => {
  const applyPreset = (preset) => {
    switch(preset) {
      case 'major':
        setMinMagnitude(5.0);
        setTimeRange('week');
        break;
      case 'local':
        setMinMagnitude(2.0);
        setTimeRange('hour');
        break;
      case 'deep':
        setMinDepth(100);
        setMaxDepth(1000);
        setMinMagnitude(4.0);
        break;
      case 'shallow':
        setMinDepth(0);
        setMaxDepth(50);
        setMinMagnitude(3.0);
        break;
      default:
        break;
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h2>🔧 Filters</h2>
        <div style={styles.presetButtons}>
          <button onClick={() => applyPreset('major')} style={styles.presetBtn}>Major Quakes</button>
          <button onClick={() => applyPreset('local')} style={styles.presetBtn}>Recent Local</button>
          <button onClick={() => applyPreset('deep')} style={styles.presetBtn}>Deep Events</button>
          <button onClick={() => applyPreset('shallow')} style={styles.presetBtn}>Shallow Events</button>
        </div>
      </div>
      
      <div style={styles.grid}>
        <div>
          <label style={styles.label}>Time Range</label>
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} style={styles.input}>
            <option value="hour">Past Hour</option>
            <option value="day">Past Day</option>
            <option value="week">Past Week</option>
            <option value="month">Past Month</option>
          </select>
        </div>

        <div>
          <label style={styles.label}>Min Magnitude: <strong>{minMagnitude}</strong></label>
          <input type="range" min="0" max="7" step="0.5" value={minMagnitude}
            onChange={(e) => setMinMagnitude(parseFloat(e.target.value))} style={{ width: '100%' }} />
        </div>

        <div>
          <label style={styles.label}>Max Results</label>
          <input type="number" min="1" max="500" value={maxResults}
            onChange={(e) => setMaxResults(parseInt(e.target.value))} style={styles.input} />
        </div>

        <div>
          <label style={styles.label}>Min Depth (km)</label>
          <input type="number" min="0" max="1000" value={minDepth}
            onChange={(e) => setMinDepth(parseFloat(e.target.value))} style={styles.input} />
        </div>

        <div>
          <label style={styles.label}>Max Depth (km)</label>
          <input type="number" min="0" max="1000" value={maxDepth}
            onChange={(e) => setMaxDepth(parseFloat(e.target.value))} style={styles.input} />
        </div>

        <div>
          <label style={styles.label}>Location Search</label>
          <input type="text" value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
            placeholder="e.g., California" style={styles.input} />
        </div>
      </div>

      <div style={styles.actions}>
        <button onClick={onFetch} disabled={isLoading} style={{
          ...styles.fetchBtn,
          background: isLoading ? '#ccc' : '#667eea',
          cursor: isLoading ? 'not-allowed' : 'pointer'
        }}>
          {isLoading ? '⏳ Loading...' : '🔍 Fetch Earthquakes'}
        </button>
        
        <label style={styles.autoRefreshLabel}>
          <input type="checkbox" checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)} />
          Auto-refresh (60s)
        </label>
      </div>
    </div>
  );
};

const styles = {
  card: { background: 'white', borderRadius: '12px', padding: '25px', marginBottom: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' },
  presetButtons: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  presetBtn: { padding: '6px 12px', fontSize: '12px', background: '#e0e0e0', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '15px' },
  label: { display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' },
  input: { width: '100%', padding: '8px', borderRadius: '4px', border: '2px solid #ddd' },
  actions: { display: 'flex', gap: '10px', alignItems: 'center' },
  fetchBtn: { flex: 1, padding: '15px', fontSize: '16px', fontWeight: 'bold', color: 'white', border: 'none', borderRadius: '6px' },
  autoRefreshLabel: { display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }
};

export default FilterPanel;