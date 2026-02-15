# Render Deployment - Quick Checklist

Complete these steps in order to deploy ResuMate on Render.com

## ✅ Phase 1: Preparation (5 minutes)

- [ ] Create GitHub account (free)
- [ ] Create Render account at [render.com](https://render.com)
- [ ] Create MongoDB Atlas account at [mongodb.com](https://www.mongodb.com)
- [ ] Get OpenAI API key
- [ ] Get ImageKit account and API keys

## ✅ Phase 2: MongoDB Setup (5 minutes)

- [ ] Create MongoDB Atlas cluster (free tier)
- [ ] Create database user (username & password)
- [ ] Get connection string with credentials
- [ ] Whitelist IPs (`0.0.0.0/0` for Render)

**Connection String Format:**
```
mongodb+srv://username:password@cluster.mongodb.net/database-name
```

## ✅ Phase 3: Push to GitHub (2 minutes)

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/resumate.git
git branch -M main
git push -u origin main
```

- [ ] Code pushed to GitHub main branch
- [ ] All files committed (no uncommitted changes)

## ✅ Phase 4: Deploy Server on Render (5 minutes)

### Step 1: Create Web Service
- [ ] Go to [render.com](https://render.com)
- [ ] Click "Create" → "Web Service"
- [ ] Connect your GitHub `resumate` repository
- [ ] Click "Connect"

### Step 2: Configure Service
- [ ] Name: `resumate-server`
- [ ] Environment: `Node`
- [ ] Region: Select closest to you
- [ ] Branch: `main`
- [ ] Build Command: 
  ```
  npm --prefix server install && npm --prefix client install && npm --prefix client run build
  ```
- [ ] Start Command: 
  ```
  npm --prefix server start
  ```
- [ ] Instance Type: `Free`
- [ ] Click "Create Web Service"

### Step 3: Add Environment Variables
In Render dashboard, add these variables:

| Key | Value |
|-----|-------|
| NODE_ENV | production |
| PORT | 3000 |
| MONGODB_URI | Your connection string from MongoDB Atlas |
| JWT_SECRET | (Generate random string) |
| OPENAI_API_KEY | Your OpenAI key |
| OPENAI_MODEL | gpt-4-turbo |
| IMAGEKIT_PUBLIC_KEY | Your ImageKit key |
| IMAGEKIT_PRIVATE_KEY | Your ImageKit private key |
| IMAGEKIT_URL_ENDPOINT | Your ImageKit endpoint |
| CORS_ORIGIN | (See Step 4 - you'll get this URL) |

- [ ] All variables added and saved
- [ ] Server building and deploying...

### Step 4: Wait for Deployment
- [ ] Server deployed successfully (status shows "Live")
- [ ] Copy the server URL (e.g., `https://resumate-server-xxxx.onrender.com`)
- [ ] Go back to environment variables
- [ ] Update `CORS_ORIGIN` to your server URL
- [ ] Save changes
- [ ] Server redeploys with CORS_ORIGIN

### Step 5: Test Server
```bash
curl https://resumate-server-xxxx.onrender.com/health
```
- [ ] Returns: `{"status": "Server is running"}`

## ✅ Phase 5: Deploy Client on Render (3 minutes)

### Step 1: Create Static Site
- [ ] Click "Create" → "Static Site"
- [ ] Select your GitHub `resumate` repository
- [ ] Click "Connect"

### Step 2: Configure
- [ ] Name: `resumate-client`
- [ ] Branch: `main`
- [ ] Build Command: `cd client && npm install && npm run build`
- [ ] Publish Directory: `client/dist`
- [ ] Click "Create Static Site"

### Step 3: Wait for Deployment
- [ ] Client deployed (status shows "Live")
- [ ] Copy the frontend URL (e.g., `https://resumate-client-xxxx.onrender.com`)

## ✅ Phase 6: Final Configuration (2 minutes)

### Update API Endpoint
1. Go to your server service on Render
2. Click "Environment"
3. Update `CORS_ORIGIN` to your client URL: `https://resumate-client-xxxx.onrender.com`
4. Click "Save Changes"
5. Server will auto-redeploy

### Create Client Environment File
```bash
# In client directory or local test
echo "VITE_BASE_URL=https://resumate-server-xxxx.onrender.com" > client/.env.production
```

Then push to GitHub:
```bash
git add client/.env.production
git commit -m "Add production API endpoint"
git push origin main
```

- [ ] Client auto-redeploys with API endpoint
- [ ] Check logs to confirm all is good

## ✅ Phase 7: Verification (5 minutes)

### Test Backend
```bash
# Health check
curl https://resumate-server-xxxx.onrender.com/health
```

### Test Frontend
- [ ] Open `https://resumate-client-xxxx.onrender.com` in browser
- [ ] Page loads without errors
- [ ] Check browser console for errors

### Test Functionality
- [ ] Register new user (should work)
- [ ] Login (should work)
- [ ] Create resume (should work)
- [ ] Check server logs for no errors

### Check Logs
- [ ] Server logs show no errors
- [ ] Client builds and serves correctly
- [ ] No CORS errors in browser console

## 🎉 Deployment Complete!

| Service | URL |
|---------|-----|
| Frontend | `https://resumate-client-xxxx.onrender.com` |
| Backend API | `https://resumate-server-xxxx.onrender.com` |
| Health Check | `https://resumate-server-xxxx.onrender.com/health` |

## 📝 Important Notes

1. **Free Tier Limitations:**
   - Server spins down after 15 minutes of inactivity
   - First request after sleep takes ~30 seconds
   - To avoid: Upgrade to Pro ($7/month)

2. **Updating Your App:**
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```
   Render will auto-redeploy automatically!

3. **MongoDB Free Tier:**
   - Max 512MB storage
   - Monitor usage
   - Upgrade when needed

4. **Keep Cluster Active:**
   - MongoDB free tier requires activity every 30 days
   - Test app regularly to keep it active

## ❓ Troubleshooting

### Server won't build
- Check build command syntax
- Look at build logs in Render dashboard
- Ensure all dependencies are correct

### MongoDB connection fails
- Verify connection string format
- Check IP whitelist (must allow `0.0.0.0/0`)
- Verify username and password are correct

### API returns 500 error
- Check server logs in Render dashboard
- Verify all environment variables are set
- Check OpenAI API key is valid

### CORS error in browser
- Verify `CORS_ORIGIN` matches frontend URL exactly
- Include `https://` protocol
- No trailing slash

### Can't upload images
- Verify ImageKit credentials
- Check ImageKit account is active
- Ensure file is JPEG, PNG, or WebP
- File must be less than 5MB

## 📞 Support

- Render Help: https://render.com/docs
- MongoDB Help: https://docs.mongodb.com/atlas/
- Check logs first before asking for help

---

**Estimated Total Time: 25-35 minutes**

✅ You're now ready to deploy ResuMate on Render!
