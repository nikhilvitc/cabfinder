// Wix Backend Functions for CabMate Finder
// These functions should be added to your Wix site's backend functions

import { fetch } from 'wix-fetch';
import wixData from 'wix-data';

// Google Sheets CSV URL
const GOOGLE_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT9OJdZugEF4Snu9cAGK3OqLxXv9BJnbXL1ccvg9mhvIkaMR4qn2o7t7isYTSgW92GRec8CDbzCFbgY/pub?output=csv';

// Collection name for storing travel data
const TRAVEL_DATA_COLLECTION = 'TravelData';

/**
 * Fetch travel data from Google Sheets and store in Wix Data Collection
 * This function can be called periodically or manually
 */
export async function syncTravelDataFromGoogleSheets() {
    try {
        console.log('Starting sync from Google Sheets...');
        
        // Fetch data from Google Sheets
        const response = await fetch(GOOGLE_SHEETS_URL, {
            method: 'GET'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvText = await response.text();
        const parsedData = parseCSVData(csvText);
        
        console.log(`Parsed ${parsedData.length} travel records`);
        
        // Clear existing data
        await wixData.remove(TRAVEL_DATA_COLLECTION, wixData.query(TRAVEL_DATA_COLLECTION));
        
        // Insert new data
        if (parsedData.length > 0) {
            await wixData.bulkInsert(TRAVEL_DATA_COLLECTION, parsedData);
        }
        
        console.log('Successfully synced travel data to Wix Data Collection');
        
        return {
            success: true,
            count: parsedData.length,
            message: `Successfully synced ${parsedData.length} travel records`
        };
        
    } catch (error) {
        console.error('Error syncing travel data:', error);
        return {
            success: false,
            error: error.message,
            message: 'Failed to sync travel data'
        };
    }
}

/**
 * Get all travel data from Wix Data Collection
 */
export async function getTravelData() {
    try {
        const results = await wixData.query(TRAVEL_DATA_COLLECTION)
            .find();
        
        return {
            success: true,
            data: results.items,
            count: results.items.length,
            lastUpdated: new Date().toISOString()
        };
    } catch (error) {
        console.error('Error fetching travel data:', error);
        return {
            success: false,
            error: error.message,
            data: [],
            count: 0
        };
    }
}

/**
 * Find compatible travel partners for a specific user
 */
export async function findTravelPartners(userData) {
    try {
        const { name, travelDate, departureTime, place } = userData;
        
        if (!travelDate || !place) {
            return {
                success: false,
                error: 'Missing required fields: travelDate, place'
            };
        }
        
        // Get all travel data
        const allData = await wixData.query(TRAVEL_DATA_COLLECTION)
            .find();
        
        const partners = findMatchingPartners(allData.items, name, travelDate, departureTime, place);
        
        return {
            success: true,
            partners: partners,
            count: partners.length
        };
        
    } catch (error) {
        console.error('Error finding travel partners:', error);
        return {
            success: false,
            error: error.message,
            partners: [],
            count: 0
        };
    }
}

/**
 * Add a new travel record
 */
export async function addTravelRecord(recordData) {
    try {
        const cleanData = {
            name: recordData.name || '',
            contact: recordData.contact || '',
            travelDate: recordData.travelDate || '',
            departureTime: recordData.departureTime || '',
            place: recordData.place || '',
            flightTrainNumber: recordData.flightTrainNumber || '',
            email: recordData.email || '',
            timestamp: new Date().toISOString()
        };
        
        const result = await wixData.save(TRAVEL_DATA_COLLECTION, cleanData);
        
        return {
            success: true,
            data: result,
            message: 'Travel record added successfully'
        };
        
    } catch (error) {
        console.error('Error adding travel record:', error);
        return {
            success: false,
            error: error.message,
            message: 'Failed to add travel record'
        };
    }
}

/**
 * Update an existing travel record
 */
export async function updateTravelRecord(recordId, updateData) {
    try {
        const result = await wixData.update(TRAVEL_DATA_COLLECTION, {
            _id: recordId,
            ...updateData
        });
        
        return {
            success: true,
            data: result,
            message: 'Travel record updated successfully'
        };
        
    } catch (error) {
        console.error('Error updating travel record:', error);
        return {
            success: false,
            error: error.message,
            message: 'Failed to update travel record'
        };
    }
}

/**
 * Delete a travel record
 */
export async function deleteTravelRecord(recordId) {
    try {
        await wixData.remove(TRAVEL_DATA_COLLECTION, recordId);
        
        return {
            success: true,
            message: 'Travel record deleted successfully'
        };
        
    } catch (error) {
        console.error('Error deleting travel record:', error);
        return {
            success: false,
            error: error.message,
            message: 'Failed to delete travel record'
        };
    }
}

/**
 * Parse CSV data from Google Sheets
 */
function parseCSVData(csvText) {
    // Fix malformed CSV by handling broken header lines
    const fixedCSV = csvText.replace(/,"\s*\n\s*Place"/g, ',"Place"');
    
    const lines = fixedCSV.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
        return [];
    }
    
    // Handle incomplete headers
    let headerLine = lines[0];
    if (headerLine.includes('"Place"') && !headerLine.includes('Flight/train number')) {
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

/**
 * Parse CSV line handling quoted values
 */
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

/**
 * Find matching partners based on travel criteria
 */
function findMatchingPartners(allData, userName, travelDate, departureTime, place) {
    const userTime = parseTime(departureTime);
    
    const matches = allData.filter(person => {
        // Don't match with self
        if (person.name === userName) return false;
        
        // Same destination (case-insensitive)
        const personPlace = person.place.toLowerCase().trim();
        const userPlace = place.toLowerCase().trim();
        if (personPlace !== userPlace) return false;
        
        // Same travel date
        if (person.travelDate !== travelDate) return false;
        
        // Time compatibility
        const personTime = parseTime(person.departureTime);
        
        // If both have no departure time, they're compatible
        if (!userTime && !personTime) return true;
        
        // If one has time and other doesn't, they're still compatible
        if (!userTime || !personTime) return true;
        
        // Time within range (-2 hours to +1 hour)
        const timeDiff = personTime.diff(userTime, 'minutes');
        return timeDiff >= -120 && timeDiff <= 60;
    });
    
    return matches.slice(0, 3); // Limit to first 3 partners
}

/**
 * Parse time string to moment-like object
 */
function parseTime(timeStr) {
    if (!timeStr) return null;
    
    try {
        const time = timeStr.trim();
        const [hours, minutes] = time.split(':').map(Number);
        
        if (isNaN(hours) || isNaN(minutes)) return null;
        
        return {
            hour: hours,
            minute: minutes,
            diff: function(other, unit) {
                const thisMinutes = this.hour * 60 + this.minute;
                const otherMinutes = other.hour * 60 + other.minute;
                return thisMinutes - otherMinutes;
            }
        };
    } catch (error) {
        console.error('Error parsing time:', timeStr, error);
        return null;
    }
}

/**
 * Health check function
 */
export async function healthCheck() {
    try {
        const dataCount = await wixData.query(TRAVEL_DATA_COLLECTION)
            .count();
        
        return {
            success: true,
            message: 'CabMate Finder API is running',
            timestamp: new Date().toISOString(),
            dataCount: dataCount
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
            timestamp: new Date().toISOString(),
            dataCount: 0
        };
    }
}


