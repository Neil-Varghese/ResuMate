# ResuMate Deployment Guide

## 🚀 Deploy on Render.com (Recommended - FREE) ⭐

**The easiest way to deploy ResuMate with zero setup required!**

👉 **See [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) for complete step-by-step instructions**

### Why Render?
- ✅ **Free tier** with no credit card required
- ✅ **Automatic GitHub integration** - deploy on every push
- ✅ **Built-in database** support with MongoDB Atlas
- ✅ **Automatic HTTPS** certificates
- ✅ **Environment management** built-in
- ✅ **One-click redeploy** and scaling
- ✅ **Easy to upgrade** when needed

### Quick Summary:
1. Push code to GitHub
2. Connect GitHub to Render
3. Set environment variables
4. Deploy! Done in 15 minutes ✨

---

## Alternative Deployment Options

### Option A: Manual Installation (For Development)

#### Server Setup

```bash
cd server
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start server
npm run server          # Development with nodemon
npm start               # Production
```

#### Client Setup

```bash
cd client
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API URL

# Build for production
npm run build

# Preview built application
npm run preview
```

---

### Option B: Docker Compose (Local Development)

```bash
# Clone the repository
git clone <repo-url>
cd resumate

# Create environment file
cp server/.env.example server/.env
# Edit server/.env with your credentials

# Build and start
docker-compose up --build -d

# View logs
docker-compose logs -f app
```

The application will be available at `http://localhost:3000`

---

### Option C: Heroku Deployment

1. Create a Heroku account and install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create resumate-app`
4. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI=<your_mongodb_url>
   heroku config:set JWT_SECRET=<your_secret>
   heroku config:set OPENAI_API_KEY=<your_key>
   heroku config:set IMAGEKIT_PUBLIC_KEY=<your_key>
   heroku config:set IMAGEKIT_PRIVATE_KEY=<your_key>
   heroku config:set IMAGEKIT_URL_ENDPOINT=<your_endpoint>
   ```
5. Deploy: `git push heroku main`

---

### Option D: AWS Deployment

#### EC2 Instance Setup:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB or connect to MongoDB Atlas
# (Skip if using MongoDB Atlas)
```

#### Clone and Setup:
```bash
git clone <repo-url>
cd resumate
npm install
cd server && npm install
cd ../client && npm install && npm run build
```

#### Configure Nginx:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

#### Setup PM2 for Process Management:
```bash
sudo npm install -g pm2
pm2 start server/server.js --name "resumate"
pm2 startup
pm2 save
```

---

## Environment Variables

Create these in your deployment platform:

```bash
# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/resume-builder

# Server
PORT=3000
NODE_ENV=production

# Security
JWT_SECRET=your_super_secret_jwt_key_here

# AI
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4-turbo

# Image Management
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint

# CORS
CORS_ORIGIN=https://yourdomain.com
```

---

## Production Checklist

- [ ] MongoDB Atlas cluster created and running
- [ ] All environment variables configured
- [ ] Strong JWT_SECRET generated (`openssl rand -base64 32`)
- [ ] OpenAI API key valid with sufficient quota
- [ ] ImageKit credentials verified
- [ ] CORS_ORIGIN set to your domain
- [ ] HTTPS/SSL enabled
- [ ] Database backups configured
- [ ] Error tracking setup (Sentry, DataDog, etc.)
- [ ] Monitoring and alerts configured
- [ ] All API endpoints tested
- [ ] User registration and login working
- [ ] Resume creation and updates working
- [ ] AI enhancement features working
- [ ] Image upload functionality verified
- [ ] No sensitive data in error messages
- [ ] Rate limiting configured (if needed)
- [ ] CDN configured for static assets (if using)

---

## Performance Optimization

### Client Side
- Enable gzip compression
- Minify CSS and JavaScript
- Optimize images
- Use CDN for static assets
- Cache static resources

### Server Side
- Enable database indexes
- Connection pooling
- Response caching
- Gzip compression
- Monitor and optimize slow queries

### Database
- Create indexes for frequently queried fields
- Regular backups
- Optimize queries
- Monitor database performance
- Archive old data if needed

---

## Troubleshooting

### MongoDB Connection Error
- Verify connection string format
- Check IP whitelist (allow Render's IPs)
- Ensure user has correct permissions
- Test connection locally first

### API Returns 500 Error
- Check Render logs for error details
- Verify all environment variables are set
- Check for typos in API keys
- Test endpoints with curl or Postman

### CORS Errors
- Verify CORS_ORIGIN matches your frontend URL
- Include protocol (https://)
- Check for trailing slashes
- Clear browser cache

### Image Upload Issues
- Verify ImageKit credentials
- Check file size is within limits (5MB)
- Ensure MIME types are supported
- Check folder permissions
- Verify ImageKit account is active

### Frontend Points to Wrong API
- Check VITE_BASE_URL in client/.env
- Verify it matches your server URL exactly
- Include full protocol and domain
- No trailing slash needed

---

## Scaling for Production

### Free Tier Issues?
- **Render Free Tier**: Spins down after 15 minutes of inactivity
  - Upgrade to Pro ($7/month) for always-on
  - Or use their pricing for production workloads

- **MongoDB Free Tier**: 512MB limit
  - Monitor data size
  - Consider upgrade when reaching limits

### Upgrade Path
1. Upgrade Render service from Free to Pro
2. Monitor usage and upgrade database as needed
3. Add Redis for caching
4. Add CDN for static assets
5. Setup load balancing for high traffic

---

## Support

- **Render Documentation**: https://render.com/docs
- **MongoDB Atlas Help**: https://docs.mongodb.com/atlas/
- **GitHub Issues**: Create issue in repository
- **Community**: Check existing issues before creating new ones

---

**Next Step**: Follow [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) for step-by-step Render deployment guide!
