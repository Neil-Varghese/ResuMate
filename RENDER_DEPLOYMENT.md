# ResuMate Deployment Guide - Render.com

Deploy your ResuMate application to Render.com for free!

## Prerequisites

1. **GitHub Account** - Your code must be pushed to GitHub
2. **Render Account** - Create free account at [render.com](https://render.com)
3. **MongoDB Atlas Account** - Free tier available at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
4. **Environment Variables** - All API keys ready (OpenAI, ImageKit)

## Step 1: Setup MongoDB Atlas (Free Database)

### 1.1 Create MongoDB Atlas Account
- Visit [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Sign up for free account
- Create a new project called "ResuMate"

### 1.2 Create a Cluster
- Click "Create a Deployment"
- Choose **Free** tier (M0)
- Select region closest to you
- Click "Create Deployment"
- Wait for cluster to be ready (2-3 minutes)

### 1.3 Get Connection String
- Go to "Database" → "Clusters"
- Click "Connect"
- Choose "Drivers"
- Copy the connection string
- **Important**: Replace `<username>` and `<password>` with actual credentials
- The URL should look like: `mongodb+srv://username:password@cluster.mongodb.net`

### 1.4 Create MongoDB User
- Go to "Security" → "Database Access"
- Click "Add New Database User"
- Username: `resumate_user` (or your choice)
- Password: Generate secure password
- Built-in Role: "Read and write to any database"
- Click "Add User"

### 1.5 Whitelist IP (Allow Render)
- Go to "Security" → "Network Access"
- Click "Add IP Address"
- Enter: `0.0.0.0/0` (allows all IPs - safe for Render)
- Click "Confirm"

---

## Step 2: Push Code to GitHub

```bash
# Initialize git if not already done
git init

# Add remote repository
git remote add origin https://github.com/yourusername/resumate.git

# Add all files
git add .

# Commit
git commit -m "Initial commit - ResuMate ready for Render deployment"

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy to Render

### 3.1 Connect GitHub to Render
1. Go to [render.com](https://render.com)
2. Sign in with GitHub account
3. Click "Create" → "Web Service"
4. Select your `resumate` repository
5. Click "Connect"

### 3.2 Configure Web Service

**Settings:**

| Field | Value |
|-------|-------|
| Name | `resumate-server` |
| Environment | `Node` |
| Region | Choose closest region |
| Branch | `main` |
| Build Command | `npm --prefix server install && npm --prefix client install && npm --prefix client run build` |
| Start Command | `npm --prefix server start` |
| Plan | `Free` (10GB RAM) |

### 3.3 Add Environment Variables
Click "Add Environment Variable" for each:

```
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://resumate_user:your_password@cluster.mongodb.net/resume-builder
JWT_SECRET=your_super_secret_jwt_key_here
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4-turbo
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint
CORS_ORIGIN=https://resumate-server-xxxx.onrender.com
```

**Note**: Replace `resumate-server-xxxx` with your actual Render service URL (visible after deployment)

### 3.4 Deploy
- Click "Create Web Service"
- Wait for deployment (3-5 minutes)
- You'll get a URL like: `https://resumate-server-xxxx.onrender.com`

---

## Step 4: Deploy Frontend (Static Site)

### 4.1 Create Static Site
1. Go to Render Dashboard
2. Click "Create" → "Static Site"
3. Select your `resumate` repository
4. Click "Connect"

### 4.2 Configure Static Site

**Settings:**

| Field | Value |
|-------|-------|
| Name | `resumate-client` |
| Branch | `main` |
| Build Command | `cd client && npm install && npm run build` |
| Publish Directory | `client/dist` |
| Plan | `Free` |

### 4.3 Update CORS Origin
After frontend deployment:
1. Go back to your Web Service (server)
2. Go to "Settings"
3. Find **CORS_ORIGIN** environment variable
4. Update to your frontend URL (e.g., `https://resumate-client-xxxx.onrender.com`)
5. Click "Save Changes"
6. Redeploy by pushing a git commit or clicking "Manual Deploy"

### 4.4 Update Client Environment
Create `client/.env.production`:
```bash
VITE_BASE_URL=https://resumate-server-xxxx.onrender.com
```

Then push to GitHub:
```bash
git add .
git commit -m "Update API endpoint for Render"
git push origin main
```

---

## Step 5: Verify Deployment

### Test API Health
```bash
curl https://resumate-server-xxxx.onrender.com/health
```

Should return:
```json
{"status": "Server is running"}
```

### Test Frontend
Visit: `https://resumate-client-xxxx.onrender.com`

---

## Troubleshooting

### Build Fails with npm errors
**Solution:**
1. Go to service settings
2. Clear build cache
3. Trigger new deployment

### MongoDB Connection Error
**Solutions:**
1. Verify connection string includes username and password
2. Check IP whitelist in MongoDB Atlas (should be `0.0.0.0/0`)
3. Ensure database user exists with correct password
4. Check MONGODB_URI format: `mongodb+srv://user:pass@cluster.mongodb.net/db-name`

### API returns 500 error
**Check logs:**
1. Go to service → "Logs"
2. Look for error messages
3. Common issues:
   - Missing environment variables
   - OpenAI API key invalid
   - ImageKit credentials wrong

### Frontend shows "Cannot POST /api/users/register"
**Solution:**
1. Check VITE_BASE_URL is set correctly in client/.env
2. Verify API URL matches server URL
3. Check CORS_ORIGIN matches frontend URL exactly

### "No module named express" or npm errors
**Solution:**
1. Ensure `npm --prefix server install` runs before start
2. Check build command runs dependencies installation
3. Clear Render cache and redeploy

---

## Production Checklist

- [ ] MongoDB Atlas cluster created and running
- [ ] Connection string in MONGODB_URI
- [ ] All environment variables set in Render
- [ ] JWT_SECRET is strong and random
- [ ] OpenAI API key is valid and has quota
- [ ] ImageKit credentials verified
- [ ] Frontend VITE_BASE_URL points to server URL
- [ ] Backend CORS_ORIGIN points to frontend URL
- [ ] Tested user registration and login
- [ ] Tested resume creation and update
- [ ] Tested AI enhancement features
- [ ] Tested image upload functionality
- [ ] No errors in Render logs
- [ ] Health check endpoint returns 200

---

## Performance Tips

1. **MongoDB Atlas Tips:**
   - Keep free tier cluster active (must have activity within 30 days)
   - Use indexes for frequently queried fields
   - Monitor data size (max 512MB on free tier)

2. **Render Tips:**
   - Free tier spins down after 15 minutes of inactivity
   - First request after spindown takes 30 seconds
   - Upgrade to Pro ($7/month) for always-on service
   - Use paid plan for production

3. **Optimization:**
   - Enable gzip compression (automatic)
   - Client static files cached by CDN
   - Consider redis for session management (if needed)

---

## Updating Your Application

To deploy updates after making changes:

```bash
# Make changes to code
# ...

# Commit and push to GitHub
git add .
git commit -m "Update description"
git push origin main
```

Render will automatically redeploy when you push to main branch.

---

## Costs

| Service | Free Tier | Monthly Cost |
|---------|-----------|--------------|
| Render Web Service | Yes (sleep inactive) | $7 (always-on) |
| Render Static Site | Yes (included) | Free |
| MongoDB Atlas | Yes (512MB) | $0 for small use |
| **Total** | **$0** | **$7** (optional) |

---

## Support

- **Render Docs**: https://render.com/docs
- **MongoDB Atlas Help**: https://docs.mongodb.com/atlas/
- **GitHub Issues**: Create issue in repository

---

**Deployment Status**: ✅ Ready for Render

Your ResuMate application is configured and ready to deploy on Render!
