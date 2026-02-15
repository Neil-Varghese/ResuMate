# ResuMate Deployment Guide

## 🚀 Deploy on Render.com (Recommended - FREE)

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

---

## Prerequisites

- Node.js 18+ (for local development/testing)
- GitHub account (for Render deployment)
- MongoDB instance (use free MongoDB Atlas)
- OpenAI API key
- ImageKit account (for image uploads)

## Environment Setup

### 1. Server Configuration

Create a `.env` file in the `server/` directory:

```bash
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017

# Server Configuration
PORT=3000
NODE_ENV=production

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret_key_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4-turbo

# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint

# CORS Configuration
CORS_ORIGIN=https://yourdomain.com
```

### 2. Client Configuration

Create a `.env` file in the `client/` directory:

```bash
VITE_BASE_URL=https://api.yourdomain.com
```

## Deployment Options

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone <repo-url>
cd resumate

# Create environment file
cp server/.env.example server/.env
# Edit server/.env with your credentials

cp client/.env.example client/.env
# Edit client/.env with your API URL

# Build and start
docker-compose up --build -d

# View logs
docker-compose logs -f app
```

The application will be available at `http://localhost:3000`

### Option 2: Manual Installation

#### Server Setup

```bash
cd server
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start server
npm run server          # Development with nodemon
node server.js          # Production
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

### Option 3: Heroku Deployment

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

### Option 4: AWS Deployment

1. **EC2 Instance Setup:**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs

   # Install MongoDB
   // Refer to MongoDB official docs for your OS

   # Install Nginx (reverse proxy)
   sudo apt install -y nginx
   ```

2. **Clone and Setup:**
   ```bash
   git clone <repo-url>
   cd resumate
   npm install
   cd server && npm install
   cd ../client && npm install && npm run build
   ```

3. **Configure Nginx:**
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

4. **Setup PM2 for Process Management:**
   ```bash
   sudo npm install -g pm2
   pm2 start server/server.js --name "resumate"
   pm2 startup
   pm2 save
   ```

## Production Checklist

- [ ] Database backup strategy in place
- [ ] Set strong `JWT_SECRET` (use: `openssl rand -base64 32`)
- [ ] Enable CORS properly for your domain
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS/SSL certificates
- [ ] Set up monitoring and error tracking
- [ ] Configure rate limiting if needed
- [ ] Set up automated backups for MongoDB
- [ ] Enable logging and log rotation
- [ ] Test all API endpoints
- [ ] Test image upload functionality
- [ ] Verify email/notification system (if applicable)
- [ ] Setup CDN for client files if using CloudFront/CloudFlare
- [ ] Test login and authentication flows
- [ ] Verify payment processing (if applicable)

## Performance Optimization

### Database
- Create indexes on frequently queried fields
- Enable MongoDB compression
- Regular maintenance and optimization

### Application
- Enable gzip compression in Nginx
- Implement caching strategies
- Use CDN for static assets
- Enable image optimization

### Monitoring
- Setup error tracking (Sentry, DataDog, etc.)
- Monitor application performance
- Setup alerts for critical issues
- Monitor database performance

## Troubleshooting

### MongoDB Connection Error
```bash
# Check connection string format
# mongodb://username:password@host:port/database
# Ensure user has appropriate permissions
```

### OpenAI API Error
- Verify API key is valid
- Check API rate limits
- Ensure model name is correct

### Image Upload Issues
- Verify ImageKit credentials
- Check folder permissions
- Ensure file size is within limits
- Verify MIME types

### CORS Errors
- Update `CORS_ORIGIN` to match your frontend domain
- Add protocol (http/https) to the origin
- Test with `curl` before deploying

## Backup & Recovery

```bash
# Backup MongoDB
mongodump --uri="mongodb://user:pass@host:port/database" --out ./backup

# Restore MongoDB
mongorestore --uri="mongodb://user:pass@host:port/database" ./backup/database-name
```

## Support

For issues and questions, create an issue on the GitHub repository.
