const axios = require('axios');
const csv = require('csv-parser');
const { Readable } = require('stream');
const crypto = require('crypto');

// Google Sheets CSV URL
const GOOGLE_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSu1eUkLS9QV1z5X8jdCFAC77SOIu6wdH_pKpuqAW5NE9XpkMZwvroAy8KqRkP979ktfZb4Aftl7fcP/pub?output=csv';

// Cache for storing parsed data
let travelData = [];
let lastFetchTime = 0;
let lastDataHash = '';
const CACHE_DURATION = 30 * 1000; // 30 seconds for real-time updates

// Function to parse CSV data
async function parseCSVData(csvText) {
  // Fix the malformed CSV by handling the broken header line
  const fixedCSV = csvText.replace(/,"\s*\n\s*Place"/g, ',"Place"');
  
  const lines = fixedCSV.split('\n').filter(line => line.trim());
  
  if (lines.length < 2) {
    return [];
  }
  
  const headerLine = lines[0];
  
  const headers = headerLine.split(',').map(h => h.trim().replace(/"/g, ''));
  const results = [];

  const getField = (row, keys) => {
    for (const key of keys) {
      if (row[key] != null && String(row[key]).trim() !== '') {
        return row[key];
      }
    }
    return '';
  };
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    
    if (values.length === headers.length) {
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      const name = getField(row, ['Name']);
      const travelDate = getField(row, ['Travel Date', 'Travel date']);
      const place = getField(row, ['Place', 'Destination']);

      // Only include rows with valid data
      if (name && travelDate && place) {
        results.push({
          id: crypto.createHash('md5').update(`${name}-${travelDate}-${place}`).digest('hex'),
          timestamp: getField(row, ['Timestamp']),
          email: getField(row, ['Email address', 'Email', 'Email Address']),
          name,
          contact: getField(row, ['Contact Number', 'Contact Number ', 'Contact number']),
          travelDate,
          departureTime: getField(row, [
            'Departure time from VITC (24hrs format)',
            'Departure time from VITC',
            'Departure time from the location',
            'Departure time from the location ',
            'Departure Time'
          ]),
          place,
          flightTrainNumber: getField(row, [
            'Flight / train',
            'Flight/train',
            'Flight/train number (optional)',
            'Flight / train number',
            'Flight/Train'
          ]),
          column9: getField(row, ['Column 9'])
        });
      }
    }
  }
  
  return results;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim().replace(/"/g, ''));
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim().replace(/"/g, ''));
  return result;
}

// Function to fetch and parse data from Google Sheets
async function fetchTravelData() {
  try {
    const response = await axios.get(GOOGLE_SHEETS_URL);
    const csvText = response.data;
    
    // Create hash of the data to check if it has changed
    const dataHash = crypto.createHash('md5').update(csvText).digest('hex');
    
    // If data hasn't changed and cache is still valid, return cached data
    if (dataHash === lastDataHash && Date.now() - lastFetchTime < CACHE_DURATION) {
      return travelData;
    }
    
    // Parse the CSV data
    const parsedData = await parseCSVData(csvText);
    
    // Update cache
    travelData = parsedData;
    lastFetchTime = Date.now();
    lastDataHash = dataHash;
    
    return parsedData;
  } catch (error) {
    console.error('Error fetching travel data:', error);
    throw error;
  }
}

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = await fetchTravelData();
    res.status(200).json({ 
      success: true, 
      data: data,
      lastUpdate: new Date().toISOString(),
      count: data.length
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch travel data',
      message: error.message 
    });
  }
}
