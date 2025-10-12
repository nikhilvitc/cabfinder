# Deploy Backend to Render

## Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and create a new repository
2. Name it `cabmate-finder` (or any name you prefer)
3. **Don't** initialize with README, .gitignore, or license (we already have files)

## Step 2: Connect Local Repository to GitHub

After creating the GitHub repo, run these commands:

```bash
cd "/Users/nikhilkumar/travel vhelp/cabmate-finder"
git remote add origin https://github.com/YOUR_USERNAME/cabmate-finder.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 3: Deploy to Render

1. Go to [render.com](https://render.com)
2. Sign up/Login with your GitHub account
3. Click "New +" → "Web Service"
4. Connect your GitHub repository (`cabmate-finder`)
5. Configure the service:
   - **Name**: `cabmate-finder-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`
6. Click "Create Web Service"

## Step 4: Update Frontend

Once deployed, Render will give you a URL like:
`https://cabmate-finder-backend.onrender.com`

Update the frontend to use this URL instead of localhost.

## Step 5: Test Deployment

Visit your Render URL + `/api/travel-data` to test:
`https://cabmate-finder-backend.onrender.com/api/travel-data`

You should see JSON data with departure times like "17:30:00" instead of empty values.
