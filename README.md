# Earthquake Visualizer

A React-based web app to visualize recent earthquake activity using the USGS Earthquake API and Leaflet maps.

## Features
- Fetches and displays earthquakes from the last day.
- Interactive map with markers (scaled by magnitude).
- Popups with details: magnitude, location, time, depth.
- Responsive design for desktop and mobile.
- Error handling for API failures.

## Tech Stack
- React (framework)
- Tailwind CSS (styling)
- Leaflet + react-leaflet (mapping)
- USGS API (data source)

## Installation
1. Clone the repo: `git clone 
2. Install dependencies: `npm install`
3. Run: `npm start`

## Usage
- App loads data on startup.
- Zoom/pan the map; click markers for info.

## Notes
- Code is clean with comments.
- Tested manually for functionality and responsiveness.
- No authentication required for API.