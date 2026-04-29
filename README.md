# 🚗 V Help Cabpool (CabMate Finder)

A modern web app that helps students find compatible cab partners using live Google Sheets travel data.

## ✨ Features

- **Live Google Sheets Sync**: Pulls latest travel records through the backend API
- **Smart Matching**: Same destination + same date + compatible departure window
- **Flexible Time Support**: If one side has no departure time, it still matches as flexible
- **Modern UI**: Glassmorphism cards, improved modal UX, and better mobile responsiveness
- **Powerful Filters**: Search by name, place, contact, date, and destination
- **Fast Fallback Matching**: Frontend computes local matching if partner API is unavailable

## 🛠️ Tech Stack

### Frontend
- **React 19** with Vite
- **TailwindCSS v4** + custom CSS for styling
- **Axios** for API calls
- **Moment.js** for date/time handling

### Backend
- **Node.js** with Express
- **CORS** for cross-origin requests
- **Google Sheets CSV ingestion** with custom parsing
- **Axios** for external API calls

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone and setup the project:**
   ```bash
   cd cabmate-finder
   npm install
   cd backend
   npm install
   ```

2. **Start the application (recommended):**
   ```bash
   # From the root directory
   npm run start:dev
   ```

   This will start both the backend server (port 3001) and frontend development server (port 5173).

### Alternative: Manual Start

1. **Start the backend:**
   ```bash
   cd backend
   npm start
   ```

2. **Start the frontend (in a new terminal):**
   ```bash
   npm run dev
   ```

## 📊 Data Source

The application fetches data from a Google Sheets CSV export:
- **URL**: `https://docs.google.com/spreadsheets/d/e/2PACX-1vSu1eUkLS9QV1z5X8jdCFAC77SOIu6wdH_pKpuqAW5NE9XpkMZwvroAy8KqRkP979ktfZb4Aftl7fcP/pub?output=csv`
- **Update Frequency**: Data is fetched on request for near real-time freshness
- **Manual Refresh**: Click the "Refresh Data" button in the header

## 🎯 How It Works

### Matching Algorithm

When you click "Find Cab Partner" for any traveler, the system finds matches based on:

1. **Same Destination**: Case-insensitive match on the "Place" field
2. **Same Travel Date**: Exact date match
3. **Compatible Time**:
   - If both times exist: partner must be within **-1 hour to +30 minutes**
   - If one/both times are missing: treated as a **flexible** match

### Example

If **Chinmay** (17/10/2025, 17:30, "VITC to Airport") clicks "Find Partner":
- ✅ **Sridhar** (17/10/2025, 17:00, "VITC to Airport") - 30 min earlier
- ✅ **Josh** (17/10/2025, 18:00, "VITC to Airport") - 30 min later
- ❌ **Abhishek** (16/10/2006, 17:00, "VITC to Airport") - Different date
- ❌ **Manav** (14/10/2025, 03:00, "VITC to Airport") - Different date

## 📱 Usage

1. **View Travel Records**: Browse all travel entries in the main table
2. **Apply Filters**: Use the top filter panel to narrow by search/date/destination
3. **Find Partners**: Click "Find Cab Partner" on any row
4. **View Matches**: See compatible travelers in the results section
5. **Contact Partners**: Use the contact buttons to reach out

## 🔧 API Endpoints

### Backend API (Port 3001)

- `GET /api/travel-data` - Fetch all travel records
- `POST /api/find-partners` - Find matching partners for a user
- `GET /api/health` - Health check endpoint
- `GET /api/check-updates` - Lightweight data-hash based update check

### Request Format for Finding Partners

```json
{
  "userId": 1,
  "name": "Chinmay Uday Sidnal",
  "travelDate": "17/10/2025",
  "departureTime": "17:30:00",
  "place": "VITC to Airport"
}
```

`departureTime` can be omitted or sent as an empty string for flexible-time matching.

## 🎨 Configuration

### Frontend API URL
- Use `VITE_API_URL` in a `.env` file to override backend base URL.
- If not set:
  - Dev: `http://localhost:3001`
  - Prod: `https://cabfinder.onrender.com`

### Data Source
- Change `GOOGLE_SHEETS_URL` in `/backend/server.js`
- Adjust cache duration with `CACHE_DURATION` variable

### Matching Criteria
- Modify time window in `findMatchingPartners()` function
- Update destination matching logic as needed

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the 'dist' folder
```

### Backend (Render/Railway/Heroku)
```bash
cd backend
# Deploy with your preferred platform
```

After pushing to GitHub, trigger a fresh redeploy for both frontend and backend so UI + matching logic update together.

## 📝 Data Structure

Each travel record contains:
- `id`: Unique identifier
- `name`: Traveler's name
- `contact`: Phone number
- `travelDate`: Date of travel (DD/MM/YYYY)
- `departureTime`: Departure time (HH:mm:ss or HH:mm, optional)
- `place`: Destination/route
- `flightTrainNumber`: Flight or train number (optional)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **Backend not starting**: Check if port 3001 is available
2. **Data not loading**: Verify Google Sheets URL is accessible
3. **CORS errors**: Ensure backend is running on port 3001
4. **No matches found**: Check date format and time parsing

### Support

For issues and questions, please check the console logs and ensure both frontend and backend are running properly.