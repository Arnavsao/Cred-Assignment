# Vercel Environment Variables Setup - Visual Guide

## 🚨 IMMEDIATE ACTION REQUIRED

Your deployment is failing because environment variables are missing. Follow these exact steps:

---

## Step-by-Step Instructions

### 1. Open Vercel Dashboard
- Go to: https://vercel.com/dashboard
- Log in if needed
- You should see your project: `cred-assignment-r7p2`

### 2. Click on Your Project
- Click on the project name: `cred-assignment-r7p2`
- You'll be taken to the project overview page

### 3. Go to Settings
- At the top of the page, click the **Settings** tab
- It's right next to "Deployments"

### 4. Open Environment Variables
- In the left sidebar, scroll down and click **Environment Variables**
- You'll see a form to add new variables

### 5. Add MONGODB_URI Variable

Click "Add New" and fill in:

```
Name: MONGODB_URI
Value: mongodb+srv://arnavsao:arnavsao1924@cluster0.dkwoiff.mongodb.net/

Select Environments:
☑️ Production
☑️ Preview
☑️ Development
```

Click **Save**

### 6. Add NODE_ENV Variable

Click "Add New" again and fill in:

```
Name: NODE_ENV
Value: production

Select Environments:
☑️ Production
☐ Preview
☐ Development
```

Click **Save**

### 7. Redeploy Your Application

- Click on the **Deployments** tab at the top
- Find the most recent deployment (top of the list)
- Click the three dots menu (**⋯**) on the right side
- Click **Redeploy**
- ✅ Check "Use existing Build Cache" (optional, makes it faster)
- Click **Redeploy** button

### 8. Wait for Deployment
- You'll see the deployment in progress
- Wait 1-2 minutes for it to complete
- Status will change from "Building" → "Ready"

### 9. Test Your Application
- Once deployment shows "Ready", click **Visit** button
- Your app should now load without errors!

---

## ✅ Expected Result

After following these steps, your application should:
- ✅ Connect to MongoDB successfully
- ✅ No more "uri must be a string" errors
- ✅ All API endpoints working
- ✅ Frontend and backend communicating properly

---

## 🔍 Verification

To verify environment variables are set:

1. Go to Settings → Environment Variables
2. You should see both variables listed:
   - `MONGODB_URI` (value hidden as dots)
   - `NODE_ENV` = `production`

---

## ⚠️ Important Notes

1. **Never commit the `.env` file to GitHub**
   - It's already in `.gitignore`
   - Only set sensitive values in Vercel dashboard

2. **MongoDB Atlas Network Access**
   - Ensure your MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
   - Or whitelist Vercel's IP addresses

3. **Database Name**
   - The connection string doesn't specify a database name
   - MongoDB will use the default database
   - To specify a database, add it to the end: `...mongodb.net/myDatabaseName`

---

## 🆘 Still Having Issues?

If deployment still fails after following these steps:

1. **Check Vercel Logs**:
   - Go to Deployments → Click on the failed deployment
   - Scroll to "Build Logs" or "Function Logs"
   - Look for specific error messages

2. **Verify MongoDB Connection String**:
   - Test it locally first
   - Make sure username/password are correct
   - Check that cluster is running

3. **Check MongoDB Atlas**:
   - Go to MongoDB Atlas dashboard
   - Navigate to Network Access
   - Ensure `0.0.0.0/0` is in the IP Access List

4. **Contact Support**:
   - If all else fails, reach out on Vercel support
   - Or check MongoDB Atlas support

---

## 📝 Summary Checklist

Before you finish, verify:

- [ ] MONGODB_URI is set in Vercel
- [ ] NODE_ENV is set to "production"
- [ ] Application has been redeployed
- [ ] Deployment shows "Ready" status
- [ ] Application loads without errors
- [ ] API endpoints are working

---

**Remember**: Environment variables are project-specific. If you create a new Vercel project, you'll need to set them again.

Good luck! 🚀
