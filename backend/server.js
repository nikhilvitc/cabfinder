const express = require('express');
const cors = require('cors');
const axios = require('axios');
const crypto = require('crypto');

const moment = require('moment');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:5174',
    'http://localhost:5175',
    'http://127.0.0.1:5173',
    'https://cabmate-finder.vercel.app',
    'https://cabmate-finder-5903ni1yg-nikhilvitcs-projects.vercel.app',
    'https://cabmate-finder-jjlnlklcx-nikhilvitcs-projects.vercel.app',
    'https://cabmate-finder-*.vercel.app',
    'https://*.vercel.app',
    'https://cabpool.vhelpcc.com',
    'https://*.vhelpcc.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Google Sheets CSV URL (override in deployment via env var)
const GOOGLE_SHEETS_URL =
  process.env.GOOGLE_SHEETS_URL ||
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vSu1eUkLS9QV1z5X8jdCFAC77SOIu6wdH_pKpuqAW5NE9XpkMZwvroAy8KqRkP979ktfZb4Aftl7fcP/pub?output=csv';

// Cache for storing parsed data
let travelData = [];
let lastFetchTime = 0;
let lastDataHash = '';
const CACHE_DURATION = 30 * 1000; // 30 seconds for real-time updates

// Function to parse CSV data
async function parseCSVData(csvText) {
  // Fix the malformed CSV by handling the broken header line
  // The CSV has a line break in the middle of the headers, so we need to fix it
  const fixedCSV = csvText.replace(/,"\s*\n\s*Place"/g, ',"Place"');
  
  const lines = fixedCSV.split('\n').filter(line => line.trim());
  
  if (lines.length < 2) {
    return [];
  }
  
  // Handle the case where headers might be split across lines
  let headerLine = lines[0];
  if (headerLine.includes('"Place"') && !headerLine.includes('Flight/train number')) {
    // If the header is incomplete, try to reconstruct it
    headerLine = 'Timestamp,Email address,Name,Contact Number ,Travel Date,Departure time from the location ,Place,Flight/train number (optional),Column 9';
  }
  
  const headers = headerLine.split(',').map(h => h.trim().replace(/"/g, ''));
  const results = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length !== headers.length) {
      continue;
    }
    
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    // Clean and structure the data
    const cleanData = {
      id: results.length + 1,
      timestamp: row.Timestamp || '',
      email: row['Email address'] || '',
      name: row.Name || '',
      contact: row['Contact Number '] || row['Contact Number'] || '',
      travelDate: row['Travel Date'] || '',
      departureTime: row['Departure time from the location'] || row['Departure time from the location '] || '',
      place: row['Place'] || '',
      flightTrainNumber: row['Flight/train number (optional)'] || '',
      column9: row['Column 9'] || ''
    };
    
    // Only add if it has essential data
    if (cleanData.name && cleanData.travelDate && cleanData.place) {
      results.push(cleanData);
    }
  }
  
  return results;
}

// Helper function to parse CSV line handling quoted values
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

// Function to generate hash of data for change detection
function generateDataHash(data) {
  const dataString = JSON.stringify(data);
  return crypto.createHash('md5').update(dataString).digest('hex');
}

// Function to fetch data from Google Sheets
async function fetchTravelData() {
  try {
    console.log('Fetching data from Google Sheets...');
    const response = await axios.get(GOOGLE_SHEETS_URL, {
      timeout: 20000,
      maxRedirects: 5,
      validateStatus: (status) => status >= 200 && status < 400,
    });
    const csvText = response.data;

    // If the sheet is no longer public, Google returns HTML/login instead of CSV.
    if (typeof csvText === 'string' && csvText.toLowerCase().includes('<html')) {
      const err = new Error(
        'Google Sheets URL is not publicly accessible. Publish the sheet to web (CSV) or provide a public CSV URL.'
      );
      err.code = 'SHEETS_NOT_PUBLIC';
      throw err;
    }

    const parsedData = await parseCSVData(csvText);
    const newDataHash = generateDataHash(parsedData);
    
    // Check if data has changed
    const hasChanged = newDataHash !== lastDataHash;
    
    if (hasChanged) {
      console.log(`📊 Data updated! Found ${parsedData.length} travel records (was ${travelData.length})`);
      if (travelData.length > 0) {
        const newEntries = parsedData.length - travelData.length;
        if (newEntries > 0) {
          console.log(`🆕 ${newEntries} new entries detected!`);
        }
      }
    } else {
      console.log(`📊 Data unchanged (${parsedData.length} records)`);
    }
    
    travelData = parsedData;
    lastFetchTime = Date.now();
    lastDataHash = newDataHash;

    return parsedData;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

// API Routes

// Health check endpoint to keep free instance alive
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    records: travelData.length 
  });
});

// Get all travel data
app.get('/api/travel-data', async (req, res) => {
  try {
    // Always check for updates to ensure real-time data
    await fetchTravelData();
    res.json({ 
      success: true, 
      data: travelData, 
      count: travelData.length, 
      lastUpdated: new Date(lastFetchTime).toISOString(),
      dataHash: lastDataHash
    });
  } catch (error) {
    // Serve stale cached data if we have it, instead of hard failing the UI.
    if (travelData.length > 0) {
      return res.json({
        success: true,
        data: travelData,
        count: travelData.length,
        lastUpdated: new Date(lastFetchTime).toISOString(),
        dataHash: lastDataHash,
        stale: true,
        warning:
          'Using cached travel data because the source sheet is temporarily inaccessible.'
      });
    }

    const status = error.response?.status || 500;
    const isSheetsAuthIssue = status === 401 || error.code === 'SHEETS_NOT_PUBLIC';
    res.status(isSheetsAuthIssue ? 502 : 500).json({
      success: false,
      error: 'Failed to fetch travel data',
      message: isSheetsAuthIssue
        ? 'Google Sheets source is not public. Publish it to web as CSV or update GOOGLE_SHEETS_URL to a public CSV link.'
        : error.message
    });
  }
});

// Check for data updates (lightweight endpoint for polling)
app.get('/api/check-updates', async (req, res) => {
  try {
    const currentHash = req.query.hash || '';
    const hasUpdates = currentHash !== lastDataHash;
    
    res.json({
      success: true,
      hasUpdates,
      currentHash: lastDataHash,
      count: travelData.length,
      lastUpdated: new Date(lastFetchTime).toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Find cab partners for a specific user
app.post('/api/find-partners', async (req, res) => {
  try {
    const { userId, name, travelDate, departureTime, place } = req.body;
    
    if (!travelDate || !place) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: travelDate, place'
      });
    }
    
    // Ensure we have fresh data
    const now = Date.now();
    if (now - lastFetchTime > CACHE_DURATION || travelData.length === 0) {
      await fetchTravelData();
    }
    
    // Find matching partners (departureTime optional = flexible)
    const partners = findMatchingPartners(userId, name, travelDate, departureTime, place);
    
    res.json({
      success: true,
      partners: partners,
      count: partners.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to find partners',
      message: error.message
    });
  }
});

// Function to find matching partners (same window as product docs: −1h to +30m when both times known)
function findMatchingPartners(userId, userName, travelDate, departureTime, place) {
  const userPlace = (place || '').toLowerCase().trim();
  const userTime = parseTime(departureTime);
  
  return travelData.filter(person => {
    // Exclude self by id (preferred) or by name if id missing
    if (userId != null && String(person.id) === String(userId)) return false;
    if (userId == null && userName && person.name === userName) return false;
    
    const personPlace = (person.place || '').toLowerCase().trim();
    if (personPlace !== userPlace) return false;
    if (person.travelDate !== travelDate) return false;
    
    const personTime = parseTime(person.departureTime);
    
    if (!userTime && !personTime) return true;
    if (!userTime || !personTime) return true;
    
    const timeDiff = personTime.diff(userTime, 'minutes');
    return timeDiff >= -60 && timeDiff <= 30;
  });
}

// Helper function to parse time (flexible / missing = null)
function parseTime(timeStr) {
  if (timeStr == null || typeof timeStr !== 'string') return null;
  const time = timeStr.trim();
  if (!time || time === 'N/A' || time === 'Not specified' || time === '-') return null;
  
  try {
    const m = moment(time, ['HH:mm:ss', 'HH:mm', 'H:mm'], true);
    return m.isValid() ? m : null;
  } catch (error) {
    console.error('Error parsing time:', timeStr, error);
    return null;
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'CabMate Finder API is running',
    timestamp: new Date().toISOString(),
    dataCount: travelData.length
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚗 CabMate Finder API running on port ${PORT}`);
  console.log(`📊 Fetching initial data from Google Sheets...`);
  
  // Fetch initial data
  fetchTravelData().catch(error => {
    console.error('Failed to fetch initial data:', error);
  });
});

module.exports = app;
