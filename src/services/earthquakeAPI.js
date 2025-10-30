const API_BASE_URL = "https://runtime.codewords.ai";
const SERVICE_ID = "earthquake_data_service_5cb8213d";

/**
 * Fetch earthquake data from CodeWords backend
 * @param {Object} params - Query parameters
 * @param {number} params.minMagnitude - Minimum earthquake magnitude
 * @param {number} params.maxResults - Maximum number of results
 * @param {string} params.timeRange - Time range (hour, day, week, month)
 * @param {string} apiKey - CodeWords API key
 * @returns {Promise<Object>} Earthquake data
 */
export async function fetchEarthquakes(
  { minMagnitude, maxResults, timeRange },
  apiKey
) {
  const response = await fetch(`${API_BASE_URL}/run/${SERVICE_ID}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      min_magnitude: minMagnitude,
      max_results: maxResults,
      time_range: timeRange,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error (${response.status}): ${errorText}`);
  }

  return response.json();
}

/**
 * Get magnitude color for visualization
 * @param {number} magnitude - Earthquake magnitude
 * @returns {string} Color hex code
 */
export function getMagnitudeColor(magnitude) {
  if (magnitude >= 7) return "#8B0000"; // Dark red - Major
  if (magnitude >= 6) return "#DC143C"; // Crimson - Strong
  if (magnitude >= 5) return "#FF4500"; // Orange Red - Moderate
  if (magnitude >= 4) return "#FFA500"; // Orange - Light
  if (magnitude >= 3) return "#FFD700"; // Gold - Minor
  return "#FFFF00"; // Yellow - Micro
}

/**
 * Get marker size based on magnitude
 * @param {number} magnitude - Earthquake magnitude
 * @returns {number} Radius in pixels
 */
export function getMarkerSize(magnitude) {
  return Math.max(4, magnitude * 2);
}
