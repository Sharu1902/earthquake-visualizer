import React from 'react';

const ChartsView = ({ earthquakes }) => {
  const getChartData = () => {
    const magBins = { '0-2': 0, '2-3': 0, '3-4': 0, '4-5': 0, '5-6': 0, '6+': 0 };
    earthquakes.forEach(eq => {
      if (eq.magnitude < 2) magBins['0-2']++;
      else if (eq.magnitude < 3) magBins['2-3']++;
      else if (eq.magnitude < 4) magBins['3-4']++;
      else if (eq.magnitude < 5) magBins['4-5']++;
      else if (eq.magnitude < 6) magBins['5-6']++;
      else magBins['6+']++;
    });

    const depthBins = { 'Shallow (0-70km)': 0, 'Intermediate (70-300km)': 0, 'Deep (300+km)': 0 };
    earthquakes.forEach(eq => {
      if (eq.depth === null) return;
      if (eq.depth < 70) depthBins['Shallow (0-70km)']++;
      else if (eq.depth < 300) depthBins['Intermediate (70-300km)']++;
      else depthBins['Deep (300+km)']++;
    });

    return { magBins, depthBins };
  };

  const chartData = getChartData();
  const totalEarthquakes = earthquakes.length;
  const earthquakesWithDepth = earthquakes.filter(eq => eq.depth).length;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📈 Data Visualization</h2>
      <div style={styles.chartsGrid}>
        <div>
          <h3 style={styles.chartTitle}>Magnitude Distribution</h3>
          <div style={styles.barsContainer}>
            {Object.entries(chartData.magBins).map(([range, count]) => (
              <div key={range} style={styles.barRow}>
                <div style={styles.barLabel}>{range}</div>
                <div style={styles.barTrack}>
                  <div style={{
                    ...styles.bar,
                    width: `${(count / totalEarthquakes) * 100}%`,
                    background: '#667eea',
                    minWidth: count > 0 ? '20px' : '0'
                  }}>{count}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 style={styles.chartTitle}>Depth Distribution</h3>
          <div style={styles.barsContainer}>
            {Object.entries(chartData.depthBins).map(([range, count]) => (
              <div key={range} style={styles.barRow}>
                <div style={{...styles.barLabel, width: '180px'}}>{range}</div>
                <div style={styles.barTrack}>
                  <div style={{
                    ...styles.bar,
                    width: earthquakesWithDepth > 0 ? `${(count / earthquakesWithDepth) * 100}%` : '0',
                    background: '#764ba2',
                    minWidth: count > 0 ? '20px' : '0'
                  }}>{count}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { background: 'white', borderRadius: '12px', padding: '25px', marginBottom: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  title: { marginBottom: '20px' },
  chartsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' },
  chartTitle: { marginBottom: '15px', fontSize: '1.1rem' },
  barsContainer: { display: 'flex', flexDirection: 'column', gap: '10px' },
  barRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  barLabel: { width: '80px', fontWeight: 'bold', fontSize: '14px' },
  barTrack: { flex: 1 },
  bar: { height: '30px', borderRadius: '4px', display: 'flex', alignItems: 'center', paddingLeft: '10px', color: 'white', fontWeight: 'bold' }
};

export default ChartsView;