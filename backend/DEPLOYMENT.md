# Render Deployment Configuration

## Option 1: Railway Deployment

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway:**
   ```bash
   railway login
   ```

3. **Initialize Railway project:**
   ```bash
   cd backend
   railway init
   ```

4. **Deploy:**
   ```bash
   railway up
   ```

## Option 2: Render Deployment

1. **Go to [render.com](https://render.com)**
2. **Connect your GitHub repository**
3. **Create a new Web Service**
4. **Configure:**
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
   - **Port:** 3001

## Option 3: Heroku Deployment

1. **Install Heroku CLI:**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku:**
   ```bash
   heroku login
   ```

3. **Create Heroku app:**
   ```bash
   cd backend
   heroku create cabmate-finder-backend
   ```

4. **Deploy:**
   ```bash
   git add .
   git commit -m "Deploy backend"
   git push heroku main
   ```

## After Deployment

Once deployed, you'll get a URL like:
- Railway: `https://cabmate-finder-backend-production.up.railway.app`
- Render: `https://cabmate-finder-backend.onrender.com`
- Heroku: `https://cabmate-finder-backend.herokuapp.com`

Update the frontend to use this URL instead of localhost.
