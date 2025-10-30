import React from 'react';
import { exportToCSV, exportToJSON } from '../utils/exportUtils';

const StatsPanel = ({ stats, earthquakes, filters, viewMode, setViewMode }) => {
  if (!stats) return null;

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h2>📊 Statistics</h2>
        <div style={styles.actions}>
          <button onClick={() => exportToCSV(earthquakes)} style={styles.actionBtn}>📥 CSV</button>
          <button onClick={() => exportToJSON(earthquakes, filters, stats)} style={styles.actionBtn}>📥 JSON</button>
          <button onClick={() => setViewMode('grid')} 
            style={{...styles.actionBtn, background: viewMode === 'grid' ? '#667eea' : '#e0e0e0', color: viewMode === 'grid' ? 'white' : '#333'}}>🔲 Grid</button>
          <button onClick={() => setViewMode('list')} 
            style={{...styles.actionBtn, background: viewMode === 'list' ? '#667eea' : '#e0e0e0', color: viewMode === 'list' ? 'white' : '#333'}}>📋 List</button>
          <button onClick={() => setViewMode('charts')} 
            style={{...styles.actionBtn, background: viewMode === 'charts' ? '#667eea' : '#e0e0e0', color: viewMode === 'charts' ? 'white' : '#333'}}>📈 Charts</button>
        </div>
      </div>
      
      <div style={styles.statsGrid}>
        <StatBox number={stats.total} label="Total Earthquakes" />
        <StatBox number={stats.maxMag} label="Max Magnitude" />
        <StatBox number={stats.avgMag} label="Avg Magnitude" />
        <StatBox number={stats.avgDepth} label="Avg Depth (km)" />
        <StatBox number={stats.highMag} label="Magnitude 5.0+" />
        <StatBox number={stats.cached ? '✓' : '⟳'} label={stats.cached ? 'Cached' : 'Fresh'} />
      </div>
    </div>
  );
};

const StatBox = ({ number, label }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>{number}</div>
    <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>{label}</div>
  </div>
);

const styles = {
  card: { background: 'white', borderRadius: '12px', padding: '25px', marginBottom: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' },
  actions: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  actionBtn: { padding: '8px 16px', fontSize: '14px', background: '#667eea', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  statsGrid: { display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '15px' }
};

export default StatsPanel;