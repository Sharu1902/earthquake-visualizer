export const exportToCSV = (earthquakes) => {
  if (earthquakes.length === 0) {
    alert('No data to export');
    return;
  }

  const headers = ['ID', 'Magnitude', 'Location', 'Latitude', 'Longitude', 'Depth (km)', 'Time', 'URL'];
  const rows = earthquakes.map(eq => [
    eq.id,
    eq.magnitude,
    `"${eq.location}"`,
    eq.latitude,
    eq.longitude,
    eq.depth || 'N/A',
    new Date(eq.time).toISOString(),
    eq.url
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `earthquakes_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
};

export const exportToJSON = (earthquakes, filters, stats) => {
  if (earthquakes.length === 0) {
    alert('No data to export');
    return;
  }

  const data = {
    exported_at: new Date().toISOString(),
    filters,
    statistics: stats,
    earthquakes
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `earthquakes_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
};

export const getMagColor = (mag) => {
  if (mag >= 5) return '#dc3545';
  if (mag >= 4) return '#ffc107';
  return '#28a745';
};