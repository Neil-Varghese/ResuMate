# Render Deployment - Getting Started Guide

## 📖 How to Read This Guide

**You have 3 options:**

### Option 1: Visual Checklist (⭐ Recommended for First Time)
👉 **[RENDER_CHECKLIST.md](RENDER_CHECKLIST.md)** - Step-by-step checkbox guide
- Easiest to follow
- All steps in order  
- Copy-paste ready commands
- **Time: 30 minutes**

### Option 2: Detailed Reference  
👉 **[RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)** - Full documentation
- Complete explanations
- Troubleshooting included
- Advanced options
- **Time: 30-45 minutes**

### Option 3: Quick Overview
👉 **[RENDER_QUICK_START.md](RENDER_QUICK_START.md)** - Quick reference
- Fast overview
- Alternative options
- Performance tips
- **Time: 15 minutes reading**

---

## ⚡ TL;DR - Deploy in 30 Minutes

```bash
# 1. Create GitHub, Render, MongoDB Atlas, OpenAI accounts

# 2. Push code to GitHub
git add .
git commit -m "Deploy to Render"
git push origin main

# 3. On Render.com:
#    - Create Web Service from GitHub repo
#    - Build: npm --prefix server install && npm --prefix client install && npm --prefix client run build
#    - Start: npm --prefix server start
#    - Add environment variables
#    - Deploy!

# 4. Create Static Site for frontend

# 5. Update CORS_ORIGIN with frontend URL

# Done! Your app is live at:
# https://resumate-server-xxxx.onrender.com
# https://resumate-client-xxxx.onrender.com
```

---

## 🎯 Pre-Deployment Checklist

### Accounts & Services (Create these first)
- [ ] GitHub account
- [ ] Render.com account  
- [ ] MongoDB Atlas account
- [ ] OpenAI API key
- [ ] ImageKit account

### Code Requirements
- [ ] Code committed and pushed to GitHub
- [ ] No `.env` file in repository (use `.env.example` only!)
- [ ] All dependencies in `package.json`
- [ ] `render.yaml` file exists (included)

---

## 📊 Deployment Flow

```
┌─────────────────────────────────────────┐
│  5 Minutes: Setup Accounts              │
│  - GitHub, Render, MongoDB, OpenAI      │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│  2 Minutes: Push to GitHub              │
│  - git push origin main                 │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│  5 Minutes: Deploy Server               │
│  - Create Render Web Service            │
│  - Configure build & start commands     │
│  - Add environment variables            │
└──────────────┬──────────────────────────┘
               ↓
         Building... (2-3 min)
               ↓
┌─────────────────────────────────────────┐
│  3 Minutes: Deploy Client               │
│  - Create Render Static Site            │
│  - Configure build command              │
└──────────────┬──────────────────────────┘
               ↓
         Building... (1-2 min)
               ↓
┌─────────────────────────────────────────┐
│  2 Minutes: Final Configuration         │
│  - Update CORS_ORIGIN with frontend URL │
│  - Update client API endpoint           │
└──────────────┬──────────────────────────┘
               ↓
      Redeploying... (30 sec)
               ↓
┌─────────────────────────────────────────┐
│  🎉 DEPLOYMENT COMPLETE!                │
│  Your app is now live!                  │
└─────────────────────────────────────────┘
```

**Total Time: ~30 minutes**

---

## 🔐 Environment Variables Needed

You'll need these when creating the Render service:

```
√ NODE_ENV = production
√ PORT = 3000
√ MONGODB_URI = mongodb+srv://...
√ JWT_SECRET = (random string)
√ OPENAI_API_KEY = your key
√ OPENAI_MODEL = gpt-4-turbo
√ IMAGEKIT_PUBLIC_KEY = your key
√ IMAGEKIT_PRIVATE_KEY = your key
√ IMAGEKIT_URL_ENDPOINT = your endpoint
√ CORS_ORIGIN = (set after deployment)
```

---

## 🚀 Build & Start Commands

### For Server Web Service

**Build Command:**
```bash
npm --prefix server install && npm --prefix client install && npm --prefix client run build
```

**Start Command:**
```bash
npm --prefix server start
```

---

## ✅ After Deployment - Verification

### Test Server is Running
```bash
curl https://resumate-server-xxxx.onrender.com/health
# Should return: {"status": "Server is running"}
```

### Test Frontend
- Open: `https://resumate-client-xxxx.onrender.com`
- Should load without errors

### Test API Connection
- Try to register a new user in the UI
- Check console for any errors
- Verify resume can be created

---

## 🐛 If Something Goes Wrong

### Check These First
1. **Render Logs** - Go to service → Logs → Look for error messages
2. **Build Output** - Check if build succeeded or failed
3. **Environment Variables** - Verify all are set correctly
4. **GitHub** - Make sure code is pushed to main branch

### Common Issues Quick Fixes

**Build Failed?**
- Check build command has no typos
- Ensure all dependencies in package.json
- Clear cache: Service Settings → Clear Build Cache → Redeploy

**MongoDB Connection Error?**
- Verify connection string format: `mongodb+srv://user:pass@cluster.mongodb.net/db`
- Check IP whitelist: MongoDB Atlas → Security → Network Access → Allow 0.0.0.0/0
- Verify username & password in string

**CORS Error in Browser?**
- Check CORS_ORIGIN matches frontend URL exactly
- Include `https://` protocol
- No trailing slash

**API Returns 500?**
- Check server logs in Render
- Verify OpenAI API key is valid
- Check ImageKit credentials are correct

---

## 📱 Mobile & Testing

Good news! Your deployed app:
- ✅ Works on mobile browsers
- ✅ Responsive design included
- ✅ Can be shared via link
- ✅ Public resume sharing works

---

## 💾 Data & Backups

**Important:**
- Data stored in MongoDB Atlas
- MongoDB free tier: Max 512MB
- Auto-backups: 7 days retention
- Manual backup: Export data from MongoDB Atlas

---

## 🔄 How to Update Your App

After deployment, if you make changes:

```bash
# 1. Make your changes
# 2. Test locally (optional)
# 3. Commit and push
git add .
git commit -m "Your changes description"
git push origin main

# Done! Render automatically redeploys within 2-3 minutes
```

---

## 🆘 Need More Help?

| Document | Use When |
|----------|----------|
| [RENDER_CHECKLIST.md](RENDER_CHECKLIST.md) | Step-by-step instructions |
| [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) | Detailed explanations needed |
| [RENDER_QUICK_START.md](RENDER_QUICK_START.md) | Want alternatives or tips |
| Server logs in Render | Debugging deployment errors |

---

## 🎓 Learning Path

1. **First Time?** → Read [RENDER_CHECKLIST.md](RENDER_CHECKLIST.md)
2. **Stuck?** → Check [RENDER_DEPLOYMENT.md#troubleshooting](RENDER_DEPLOYMENT.md#troubleshooting)
3. **Want more?** → Read [RENDER_QUICK_START.md](RENDER_QUICK_START.md)
4. **Advanced?** → Check [render.yaml](render.yaml) and customize

---

## 🎉 Ready to Deploy?

👉 **Start with: [RENDER_CHECKLIST.md](RENDER_CHECKLIST.md)**

It has everything you need in checklist format!

**Estimated time to live deployment: 30 minutes** ⏱️

---

**Questions about Render?** → https://render.com/docs
**Questions about MongoDB?** → https://docs.mongodb.com/atlas
**Questions about your code?** → Check the repo issues or create new one
