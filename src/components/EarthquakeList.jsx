import React from 'react';
import { getMagColor } from '../utils/exportUtils';

const EarthquakeList = ({ earthquakes }) => {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📋 List View</h2>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.th}>Magnitude</th>
              <th style={styles.th}>Location</th>
              <th style={styles.th}>Depth (km)</th>
              <th style={styles.th}>Time</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {earthquakes.map((eq) => (
              <tr key={eq.id} style={styles.row}>
                <td style={{...styles.td, fontWeight: 'bold', color: getMagColor(eq.magnitude)}}>
                  M{eq.magnitude.toFixed(1)}
                </td>
                <td style={styles.td}>{eq.location}</td>
                <td style={styles.td}>{eq.depth ? eq.depth.toFixed(1) : 'N/A'}</td>
                <td style={styles.td}>{new Date(eq.time).toLocaleString()}</td>
                <td style={styles.td}>
                  <a href={eq.url} target="_blank" rel="noopener noreferrer" style={styles.link}>View →</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: { background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  title: { marginBottom: '20px' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  headerRow: { background: '#f5f5f5' },
  th: { padding: '12px', textAlign: 'left', fontWeight: 'bold' },
  row: { borderBottom: '1px solid #e0e0e0' },
  td: { padding: '12px' },
  link: { color: '#667eea', textDecoration: 'none' }
};

export default EarthquakeList;