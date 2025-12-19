# Deployment Guide for Vercel

## Quick Fix for Current Error

Your deployment is failing because **environment variables are not set in Vercel**. Follow these steps:

### Step 1: Set Environment Variables in Vercel

1. Go to https://vercel.com/dashboard
2. Select your project: `cred-assignment-r7p2`
3. Click on **Settings** tab
4. Click on **Environment Variables** in the left sidebar
5. Add these variables:

#### Variable 1: MongoDB URI
- **Key**: `MONGODB_URI`
- **Value**: `mongodb+srv://arnavsao:arnavsao1924@cluster0.dkwoiff.mongodb.net/`
- **Environments**: Check all three boxes (Production, Preview, Development)
- Click **Save**

#### Variable 2: Node Environment
- **Key**: `NODE_ENV`
- **Value**: `production`
- **Environments**: Check "Production" only
- Click **Save**

### Step 2: Redeploy

1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the three dots (⋯) on the right
4. Select **Redeploy**
5. Wait for deployment to complete

### Step 3: Verify

Once redeployed, visit your URL and it should work without errors.

---

## Alternative: Deploy Separate Frontend and Backend

If the above doesn't work, you can deploy frontend and backend separately:

### Backend Deployment

1. Create a new Vercel project for backend only
2. Set root directory to `backend`
3. Add environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `NODE_ENV`: `production`
4. Deploy

### Frontend Deployment

1. Create a new Vercel project for frontend
2. Set root directory to `frontend`
3. Update `frontend/src/services/api.js`:
   ```javascript
   const API_BASE_URL = 'https://your-backend-url.vercel.app/api';
   ```
4. Deploy

---

## Common Issues

### Issue 1: "uri must be a string, got undefined"
**Cause**: MONGODB_URI environment variable not set
**Fix**: Follow Step 1 above

### Issue 2: CORS errors
**Cause**: Backend doesn't allow frontend domain
**Fix**: Update CORS config in backend to allow your frontend URL

### Issue 3: 404 on API calls
**Cause**: Routes not configured properly
**Fix**: Ensure all API calls go to `/api/*` paths

---

## Vercel Configuration Files

The project includes:

- `vercel.json` - Configures how Vercel builds and routes your app
- `api/index.js` - Entry point for serverless backend

These files tell Vercel:
1. Where the backend code is
2. How to handle API routes
3. How to build the application

---

## Security Note

**IMPORTANT**: Never commit `.env` files or expose credentials in code!

- `.env` is in `.gitignore`
- Use `.env.example` for documentation
- Set real values only in Vercel dashboard

---

## Need Help?

If you're still having issues after following this guide:

1. Check Vercel deployment logs for specific errors
2. Verify all environment variables are set correctly
3. Ensure MongoDB connection string is valid
4. Check that MongoDB allows connections from Vercel IPs (0.0.0.0/0)

---

**Note**: This guide assumes you're using the Vercel dashboard. You can also use Vercel CLI for deployment, but dashboard is recommended for first-time setup.
