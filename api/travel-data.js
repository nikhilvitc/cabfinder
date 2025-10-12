const axios = require('axios');
const csv = require('csv-parser');
const { Readable } = require('stream');
const crypto = require('crypto');

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
  const fixedCSV = csvText.replace(/,"\s*\n\s*Place"/g, ',"Place"');
  
  const lines = fixedCSV.split('\n').filter(line => line.trim());
  
  if (lines.length < 2) {
    return [];
  }
  
  // Handle the case where headers might be split across lines
  let headerLine = lines[0];
  if (headerLine.includes('"Place"') && !headerLine.includes('Flight/train number')) {
    headerLine = 'Timestamp,Email address,Name,Contact Number ,Travel Date,Departure time from the location ,Place,Flight/train number (optional),Column 9';
  }
  
  const headers = headerLine.split(',').map(h => h.trim().replace(/"/g, ''));
  const results = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    
    if (values.length >= headers.length) {
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      // Only include rows with valid data
      if (row['Name'] && row['Travel Date'] && row['Place']) {
        results.push({
          id: crypto.createHash('md5').update(`${row['Name']}-${row['Travel Date']}-${row['Place']}`).digest('hex'),
          timestamp: row['Timestamp'] || '',
          email: row['Email address'] || '',
          name: row['Name'] || '',
          contact: row['Contact Number '] || '',
          travelDate: row['Travel Date'] || '',
          departureTime: row['Departure time from the location'] || row['Departure time from the location '] || '',
          place: row['Place'] || '',
          flightTrainNumber: row['Flight/train number (optional)'] || '',
          column9: row['Column 9'] || ''
        });
      }
    }
  }
  
  return results;
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
