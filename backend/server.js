const express = require('express');
const cors = require('cors');
const axios = require('axios');
const csv = require('csv-parser');
const { Readable } = require('stream');
const crypto = require('crypto');

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
    'https://cabmate-finder-*.vercel.app',
    'https://*.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Google Sheets CSV URL
const GOOGLE_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT9OJdZugEF4Snu9cAGK3OqLxXv9BJnbXL1ccvg9mhvIkaMR4qn2o7t7isYTSgW92GRec8CDbzCFbgY/pub?output=csv';

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
    const response = await axios.get(GOOGLE_SHEETS_URL);
    const csvText = response.data;

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
    res.status(500).json({
      success: false,
      error: 'Failed to fetch travel data',
      message: error.message
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
    
    if (!travelDate || !departureTime || !place) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: travelDate, departureTime, place'
      });
    }
    
    // Ensure we have fresh data
    const now = Date.now();
    if (now - lastFetchTime > CACHE_DURATION || travelData.length === 0) {
      await fetchTravelData();
    }
    
    // Find matching partners
    const partners = findMatchingPartners(name, travelDate, departureTime, place);
    
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

// Function to find matching partners
function findMatchingPartners(userName, travelDate, departureTime, place) {
  const userTime = parseTime(departureTime);
  if (!userTime) return [];
  
  const matches = travelData.filter(person => {
    // Don't match with self
    if (person.name === userName) return false;
    
    // Same destination (case-insensitive)
    const personPlace = person.place.toLowerCase().trim();
    const userPlace = place.toLowerCase().trim();
    if (personPlace !== userPlace) return false;
    
    // Same travel date
    if (person.travelDate !== travelDate) return false;
    
    // Time within range (-1 hour to +30 minutes)
    const personTime = parseTime(person.departureTime);
    if (!personTime) return false;
    
    const timeDiff = personTime.diff(userTime, 'minutes');
    return timeDiff >= -60 && timeDiff <= 30; // -1 hour to +30 minutes
  });
  
  return matches;
}

// Helper function to parse time
function parseTime(timeStr) {
  if (!timeStr) return null;
  
  try {
    // Handle different time formats
    const time = timeStr.trim();
    const [hours, minutes] = time.split(':').map(Number);
    
    if (isNaN(hours) || isNaN(minutes)) return null;
    
    // Create a moment object for today with the given time
    const moment = require('moment');
    return moment().hour(hours).minute(minutes).second(0);
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
