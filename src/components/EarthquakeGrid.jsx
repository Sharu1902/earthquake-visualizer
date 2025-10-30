import React from 'react';
import EarthquakeCard from './EarthquakeCard';

const EarthquakeGrid = ({ earthquakes }) => {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🔲 Grid View</h2>
      <div style={styles.grid}>
        {earthquakes.map((eq) => (
          <EarthquakeCard key={eq.id} earthquake={eq} />
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  title: { marginBottom: '20px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }
};

export default EarthquakeGrid;