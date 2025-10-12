# CabMate Finder Backend

This is the backend API for the CabMate Finder application, deployed on Railway.

## Features

- **Express.js API Server** - RESTful API endpoints
- **Google Sheets Integration** - Fetches travel data from Google Sheets CSV
- **CORS Support** - Configured for Vercel frontend deployment
- **Caching** - 30-second cache for performance
- **Error Handling** - Comprehensive error handling and logging

## API Endpoints

### GET /api/travel-data
Returns all travel data from Google Sheets.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "unique_id",
      "timestamp": "11/10/2025 14:57:49",
      "email": "user@example.com",
      "name": "User Name",
      "contact": "+1234567890",
      "travelDate": "17/10/2025",
      "departureTime": "10:30",
      "place": "VITC to Airport",
      "flightTrainNumber": "6E-6487",
      "column9": ""
    }
  ],
  "lastUpdate": "2025-10-12T13:56:43.382Z",
  "count": 228
}
```

## Environment Variables

- `PORT` - Server port (automatically set by Railway)
- `NODE_ENV` - Environment (production/development)

## Deployment

This backend is deployed on Railway and automatically configured for:
- Automatic deployments from Git
- Health checks
- Environment variable management
- SSL/HTTPS support

## CORS Configuration

The API is configured to accept requests from:
- `http://localhost:5173` (development)
- `https://cabmate-finder.vercel.app` (production)
- `https://cabmate-finder-*.vercel.app` (preview deployments)
