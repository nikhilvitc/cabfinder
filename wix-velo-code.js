// Wix Velo Code for CabMate Finder
// Copy this code to your Wix site's page code section

import wixData from 'wix-data';
import { fetch } from 'wix-fetch';

$w.onReady(function () {
    // Initialize the application
    initializeApp();
});

// Global variables
let travelData = [];
let filteredData = [];
let currentFilters = {
    search: '',
    date: '',
    destination: ''
};

// Initialize the application
async function initializeApp() {
    try {
        showLoading(true);
        await fetchTravelData();
        setupEventHandlers();
        updateUI();
    } catch (error) {
        console.error('Error initializing app:', error);
        showError('Failed to initialize the application');
    } finally {
        showLoading(false);
    }
}

// Fetch travel data from backend
async function fetchTravelData() {
    try {
        // Option 1: Use external API (requires CORS setup)
        const response = await fetch('https://cabfinder.onrender.com/api/travel-data', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            travelData = result.data || [];
            filteredData = [...travelData];
            updateLastUpdateTime();
        } else {
            throw new Error('Failed to fetch data from server');
        }
    } catch (error) {
        console.error('Error fetching travel data:', error);
        
        // Fallback to mock data if API fails
        travelData = getMockData();
        filteredData = [...travelData];
        showError('Backend server not running. Showing demo data.');
    }
}

// Mock data for demo purposes
function getMockData() {
    return [
        {
            id: 1,
            name: 'John Doe',
            contact: '+1234567890',
            travelDate: '2024-01-15',
            departureTime: '10:30:00',
            place: 'New York',
            flightTrainNumber: 'AA123'
        },
        {
            id: 2,
            name: 'Jane Smith',
            contact: '+0987654321',
            travelDate: '2024-01-15',
            departureTime: '11:00:00',
            place: 'New York',
            flightTrainNumber: 'UA456'
        },
        {
            id: 3,
            name: 'Mike Johnson',
            contact: '+1122334455',
            travelDate: '2024-01-16',
            departureTime: '14:30:00',
            place: 'Los Angeles',
            flightTrainNumber: 'DL789'
        }
    ];
}

// Setup event handlers
function setupEventHandlers() {
    // Search input
    $w('#searchInput').onChange((event) => {
        currentFilters.search = event.target.value;
        applyFilters();
    });

    // Date filter
    $w('#dateFilter').onChange((event) => {
        currentFilters.date = event.target.value;
        applyFilters();
    });

    // Destination filter
    $w('#destinationFilter').onChange((event) => {
        currentFilters.destination = event.target.value;
        applyFilters();
    });

    // Refresh button
    $w('#refreshButton').onClick(() => {
        refreshData();
    });

    // Clear filters button
    $w('#clearFiltersButton').onClick(() => {
        clearFilters();
    });

    // Dismiss error button
    $w('#dismissError').onClick(() => {
        hideError();
    });

    // Close modal button
    $w('#closeModal').onClick(() => {
        closePartnerModal();
    });
}

// Apply filters to data
function applyFilters() {
    let filtered = [...travelData];

    // Apply search filter
    if (currentFilters.search && currentFilters.search.trim()) {
        const searchLower = currentFilters.search.toLowerCase().trim();
        filtered = filtered.filter(person => {
            const name = (person.name || '').toLowerCase();
            const place = (person.place || '').toLowerCase();
            const contact = (person.contact || '').toLowerCase();
            const flightTrain = (person.flightTrainNumber || '').toLowerCase();
            
            return name.includes(searchLower) ||
                   place.includes(searchLower) ||
                   contact.includes(searchLower) ||
                   flightTrain.includes(searchLower);
        });
    }

    // Apply date filter
    if (currentFilters.date && currentFilters.date.trim()) {
        filtered = filtered.filter(person => person.travelDate === currentFilters.date);
    }

    // Apply destination filter
    if (currentFilters.destination && currentFilters.destination.trim()) {
        filtered = filtered.filter(person => person.place === currentFilters.destination);
    }

    filteredData = filtered;
    updateUI();
}

// Clear all filters
function clearFilters() {
    currentFilters = {
        search: '',
        date: '',
        destination: ''
    };
    
    $w('#searchInput').value = '';
    $w('#dateFilter').value = '';
    $w('#destinationFilter').value = '';
    
    filteredData = [...travelData];
    updateUI();
}

// Update UI elements
function updateUI() {
    updateRecordCount();
    updateFilterOptions();
    updateTravelTable();
    updateTableTitle();
}

// Update record count
function updateRecordCount() {
    $w('#recordCount').text = `${travelData.length} records`;
}

// Update filter options
function updateFilterOptions() {
    // Update date filter options
    const uniqueDates = [...new Set(travelData.map(item => item.travelDate))].sort();
    const dateFilter = $w('#dateFilter');
    
    // Clear existing options except first
    dateFilter.options = ['All Dates'];
    uniqueDates.forEach(date => {
        dateFilter.options.push(date);
    });

    // Update destination filter options
    const uniqueDestinations = [...new Set(travelData.map(item => item.place))].sort();
    const destinationFilter = $w('#destinationFilter');
    
    // Clear existing options except first
    destinationFilter.options = ['All Destinations'];
    uniqueDestinations.forEach(destination => {
        destinationFilter.options.push(destination);
    });
}

// Update table title
function updateTableTitle() {
    $w('#tableTitle').text = `Travel Records (${filteredData.length})`;
}

// Update travel table using repeater
function updateTravelTable() {
    const repeater = $w('#travelRepeater');
    
    if (filteredData.length === 0) {
        repeater.hide();
        $w('#emptyState').show();
    } else {
        repeater.show();
        $w('#emptyState').hide();
        
        // Set repeater data
        repeater.data = filteredData;
        
        // Configure repeater item
        repeater.onItemReady(($item, itemData) => {
            $item('#personName').text = itemData.name;
            $item('#personContact').text = itemData.contact;
            $item('#personDate').text = itemData.travelDate;
            $item('#personTime').text = itemData.departureTime || 'Flexible';
            $item('#personDestination').text = itemData.place;
            $item('#personFlight').text = itemData.flightTrainNumber || 'Not specified';
            
            // Find partners button
            $item('#findPartnerBtn').onClick(() => {
                findPartners(itemData);
            });
        });
    }
}

// Find compatible partners
function findPartners(user) {
    const userTime = user.departureTime;
    const userDate = user.travelDate;
    const userPlace = user.place;

    // Helper function to check if time is empty/invalid
    const isEmptyTime = (time) => {
        return !time || time.trim() === '' || time === 'N/A' || time === 'Not specified';
    };

    const compatiblePartners = travelData.filter(person => {
        // Don't include the user themselves
        if (person.id === user.id) return false;
        
        // Must be same destination and date
        if (person.place !== userPlace || person.travelDate !== userDate) return false;
        
        const userTimeEmpty = isEmptyTime(userTime);
        const partnerTimeEmpty = isEmptyTime(person.departureTime);
        
        // If both have no departure time, they're compatible (flexible matching)
        if (userTimeEmpty && partnerTimeEmpty) {
            return true;
        }
        
        // If one has time and other doesn't, they're still compatible (flexible matching)
        if (userTimeEmpty || partnerTimeEmpty) {
            return true;
        }
        
        // Time compatibility: within -2 hours to +1 hour (only if both have valid times)
        try {
            const userMoment = parseTime(userTime);
            const partnerMoment = parseTime(person.departureTime);
            
            if (!userMoment || !partnerMoment) {
                return false;
            }
            
            const diffMinutes = partnerMoment.diff(userMoment, 'minutes');
            return diffMinutes >= -120 && diffMinutes <= 60;
        } catch {
            return false;
        }
    }).slice(0, 3); // Limit to first 3 partners

    showPartnerModal(user, compatiblePartners);
}

// Parse time string to moment object
function parseTime(timeStr) {
    if (!timeStr) return null;
    
    try {
        const time = timeStr.trim();
        const [hours, minutes] = time.split(':').map(Number);
        
        if (isNaN(hours) || isNaN(minutes)) return null;
        
        // Create a moment-like object for time comparison
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

// Show partner modal
function showPartnerModal(selectedUser, partners) {
    $w('#selectedUserInfo').html = `
        <div class="selected-user-info">
            <h4>Selected Traveler</h4>
            <p><strong>Name:</strong> ${selectedUser.name}</p>
            <p><strong>Date:</strong> ${selectedUser.travelDate}</p>
            <p><strong>Time:</strong> ${selectedUser.departureTime || 'Flexible'}</p>
            <p><strong>Destination:</strong> ${selectedUser.place}</p>
        </div>
    `;

    const partnersRepeater = $w('#partnersRepeater');
    
    if (partners.length === 0) {
        partnersRepeater.hide();
        $w('#noPartnersMessage').show();
    } else {
        partnersRepeater.show();
        $w('#noPartnersMessage').hide();
        
        partnersRepeater.data = partners;
        
        partnersRepeater.onItemReady(($item, itemData) => {
            $item('#partnerName').text = itemData.name;
            $item('#partnerContact').text = itemData.contact;
            $item('#partnerTime').text = itemData.departureTime || 'Flexible';
            $item('#partnerFlight').text = itemData.flightTrainNumber || 'Not specified';
        });
    }

    $w('#partnerModal').show();
}

// Close partner modal
function closePartnerModal() {
    $w('#partnerModal').hide();
}

// Refresh data
async function refreshData() {
    try {
        showLoading(true);
        hideError();
        await fetchTravelData();
        applyFilters();
        updateUI();
    } catch (error) {
        console.error('Error refreshing data:', error);
        showError('Failed to refresh data');
    } finally {
        showLoading(false);
    }
}

// Show/hide loading spinner
function showLoading(show) {
    if (show) {
        $w('#loadingSpinner').show();
    } else {
        $w('#loadingSpinner').hide();
    }
}

// Show error message
function showError(message) {
    $w('#errorText').text = message;
    $w('#errorMessage').show();
}

// Hide error message
function hideError() {
    $w('#errorMessage').hide();
}

// Update last update time
function updateLastUpdateTime() {
    const now = new Date();
    $w('#lastUpdate').text = `Last updated: ${now.toLocaleString()}`;
}


