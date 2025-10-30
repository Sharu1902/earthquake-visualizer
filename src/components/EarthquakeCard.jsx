import React from 'react';
import { getMagColor } from '../utils/exportUtils';

const EarthquakeCard = ({ earthquake }) => {
  const color = getMagColor(earthquake.magnitude);
  
  return (
    <div style={{ ...styles.card, borderLeft: `4px solid ${color}` }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
      <h3 style={styles.title}>⚡ M{earthquake.magnitude.toFixed(1)}</h3>
      <p style={styles.text}><strong>📍 Location:</strong> {earthquake.location}</p>
      <p style={styles.text}><strong>🌐 Coordinates:</strong> {earthquake.latitude?.toFixed(2)}°, {earthquake.longitude?.toFixed(2)}°</p>
      <p style={styles.text}><strong>⬇️ Depth:</strong> {earthquake.depth ? `${earthquake.depth.toFixed(1)} km` : 'N/A'}</p>
      <p style={styles.text}><strong>🕐 Time:</strong> {new Date(earthquake.time).toLocaleString()}</p>
      <a href={earthquake.url} target="_blank" rel="noopener noreferrer" style={styles.link}>
        View Details on USGS →
      </a>
    </div>
  );
};

const styles = {
  card: { background: '#f9f9f9', padding: '15px', borderRadius: '6px', transition: 'transform 0.2s', cursor: 'pointer' },
  title: { marginBottom: '10px', fontSize: '1.2rem' },
  text: { margin: '5px 0', fontSize: '14px', color: '#333' },
  link: { display: 'inline-block', marginTop: '10px', color: '#667eea', textDecoration: 'none', fontWeight: 'bold' }
};

export default EarthquakeCard;