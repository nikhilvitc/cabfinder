# Complete Wix Velo Setup Guide for CabMate Finder

## Overview

This guide will help you convert your React-based CabMate Finder application to work with Wix Velo. The application allows users to find travel partners by matching travel dates, times, and destinations.

## Prerequisites

- Wix Premium plan (required for Velo)
- Access to Wix Editor
- Basic understanding of JavaScript
- Your existing Google Sheets with travel data

## Step 1: Create Wix Data Collection

1. **Go to your Wix site dashboard**
2. **Navigate to Database → Collections**
3. **Create a new collection called "TravelData"**
4. **Add the following fields:**

| Field Name | Field Type | Required |
|------------|------------|----------|
| name | Text | Yes |
| contact | Text | No |
| travelDate | Date | Yes |
| departureTime | Text | No |
| place | Text | Yes |
| flightTrainNumber | Text | No |
| email | Text | No |
| timestamp | Date & Time | Yes |

## Step 2: Set Up Page Elements

### Create the following elements in your Wix page:

#### Text Elements:
- `#headerTitle` - Main title "CabMate Finder"
- `#lastUpdate` - Last update timestamp
- `#recordCount` - Total record count
- `#errorText` - Error message text
- `#tableTitle` - Table title with count
- `#modalTitle` - Modal title

#### Input Elements:
- `#searchInput` - Search text input
- `#dateFilter` - Date dropdown
- `#destinationFilter` - Destination dropdown

#### Button Elements:
- `#refreshButton` - Refresh data button
- `#clearFiltersButton` - Clear filters button
- `#dismissError` - Dismiss error button
- `#closeModal` - Close modal button

#### Repeater Elements:
- `#travelRepeater` - For travel records
- `#partnersRepeater` - For partner results (inside modal)

#### Container Elements:
- `#errorMessage` - Error message container
- `#partnerModal` - Modal container
- `#emptyState` - Empty state container
- `#loadingSpinner` - Loading spinner container

## Step 3: Add Backend Functions

1. **Go to Backend → Functions**
2. **Create a new function called "syncTravelDataFromGoogleSheets"**
3. **Copy the code from `wix-backend-functions.js`**
4. **Create additional functions:**
   - `getTravelData`
   - `findTravelPartners`
   - `addTravelRecord`
   - `updateTravelRecord`
   - `deleteTravelRecord`
   - `healthCheck`

## Step 4: Add Frontend Code

1. **Go to your page in Wix Editor**
2. **Click on the page → Page Code**
3. **Copy the code from `wix-velo-code.js`**
4. **Paste it into the page code section**

## Step 5: Add Styling

1. **Go to Design → Custom CSS**
2. **Copy the CSS from `wix-styles.css`**
3. **Paste it into the custom CSS section**

## Step 6: Configure Repeater Elements

### For Travel Repeater (`#travelRepeater`):
1. **Add the following elements inside the repeater:**
   - `#personName` (Text)
   - `#personContact` (Text)
   - `#personDate` (Text)
   - `#personTime` (Text)
   - `#personDestination` (Text)
   - `#personFlight` (Text)
   - `#findPartnerBtn` (Button)

### For Partners Repeater (`#partnersRepeater`):
1. **Add the following elements inside the repeater:**
   - `#partnerName` (Text)
   - `#partnerContact` (Text)
   - `#partnerTime` (Text)
   - `#partnerFlight` (Text)

## Step 7: Set Up Data Sync

### Option A: Manual Sync (Recommended for testing)
1. **Go to Backend → Functions**
2. **Run `syncTravelDataFromGoogleSheets` function manually**
3. **Check if data appears in your TravelData collection**

### Option B: Scheduled Sync
1. **Go to Backend → Scheduled Functions**
2. **Create a new scheduled function**
3. **Set it to run every 30 minutes**
4. **Call `syncTravelDataFromGoogleSheets`**

## Step 8: Test the Application

1. **Preview your site**
2. **Check if travel data loads**
3. **Test the search functionality**
4. **Test the filter options**
5. **Test the partner finding feature**
6. **Test the modal display**

## Step 9: Customize and Deploy

1. **Adjust styling to match your brand**
2. **Modify the Google Sheets URL if needed**
3. **Test on different devices**
4. **Publish your site**

## Troubleshooting

### Common Issues:

#### 1. Data Not Loading
- **Check if the Google Sheets URL is correct**
- **Verify the CSV format matches expected structure**
- **Check browser console for errors**
- **Ensure backend functions are properly deployed**

#### 2. CORS Errors
- **Use Wix Data Collections instead of external APIs**
- **Or set up proper CORS headers on your backend**

#### 3. Repeater Not Displaying Data
- **Check if repeater elements have correct IDs**
- **Verify data structure matches repeater expectations**
- **Check if data is properly formatted**

#### 4. Modal Not Working
- **Ensure modal elements are properly configured**
- **Check if JavaScript event handlers are attached**
- **Verify CSS display properties**

### Debug Tips:

1. **Use `console.log()` statements in your code**
2. **Check Wix's developer tools**
3. **Test functions individually in the backend**
4. **Use the browser's developer console**

## Advanced Features

### Adding New Travel Records
You can extend the application to allow users to add their own travel records:

1. **Create a form with input fields**
2. **Use the `addTravelRecord` backend function**
3. **Refresh the data after adding**

### Real-time Updates
For real-time updates:

1. **Set up a scheduled function to run every 5 minutes**
2. **Use `wix-location-frontend` to refresh the page**
3. **Or implement polling in the frontend code**

### User Authentication
To add user authentication:

1. **Use Wix's built-in authentication**
2. **Store user-specific data**
3. **Add user permissions**

## Performance Optimization

1. **Limit the number of records displayed**
2. **Implement pagination**
3. **Use efficient filtering**
4. **Cache frequently accessed data**

## Security Considerations

1. **Validate all input data**
2. **Use proper error handling**
3. **Implement rate limiting**
4. **Protect sensitive data**

## Support and Resources

- **Wix Velo Documentation**: https://www.wix.com/velo/reference
- **Wix Community**: https://www.wix.com/velo/forum
- **Wix Support**: Available through your Wix dashboard

## Conclusion

Your CabMate Finder application is now ready to run on Wix Velo! The application provides:

- ✅ Travel data synchronization from Google Sheets
- ✅ Search and filtering capabilities
- ✅ Partner matching algorithm
- ✅ Responsive design
- ✅ Error handling
- ✅ Loading states

Remember to test thoroughly and customize the styling to match your brand. The application is designed to be scalable and maintainable within the Wix ecosystem.


