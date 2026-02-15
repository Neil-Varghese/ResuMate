# ResuMate - AI-Powered Resume Builder

A modern web application that helps users create, customize, and enhance their resumes using AI technology.

## Features

- 🎨 **Multiple Resume Templates** - Choose from Classic, Minimal, Modern, and Minimal Image templates
- ✨ **AI-Powered Enhancements** - Use OpenAI to enhance professional summaries and job descriptions
- 📸 **Image Management** - Upload and customize profile pictures with background removal
- 🎯 **Smart Form Validation** - Real-time form validation and error handling
- 🔐 **Secure Authentication** - JWT-based user authentication with password hashing
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- ☁️ **Cloud Storage** - ImageKit integration for reliable image hosting
- 🚀 **One-Click Deploy** - Deploy to Render.com with one click

## Tech Stack

### Frontend
- React 19
- Redux Toolkit for state management
- Tailwind CSS for styling
- Vite for fast development
- React Router for navigation

### Backend
- Express.js 5
- Node.js 20
- MongoDB for database
- OpenAI API for AI features
- ImageKit for image management
- JWT for authentication

### Deployment
- **Recommended**: Render.com (free tier available)
- Alternative: Docker, Heroku, AWS, or manual installation

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd resumate
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Setup environment variables**
   ```bash
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```
   Edit these files with your actual values

4. **Start development servers**
   ```bash
   npm run dev
   ```
   - Server: http://localhost:3000
   - Client: http://localhost:5173

### Environment Variables

**Server (.env)**
```bash
MONGODB_URI=mongodb://localhost:27017
PORT=3000
JWT_SECRET=your_secret_key_here
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4-turbo
IMAGEKIT_PUBLIC_KEY=your_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint
CORS_ORIGIN=http://localhost:5173
```

**Client (.env)**
```bash
VITE_BASE_URL=http://localhost:3000
```

## Deployment

### Deploy on Render (Recommended - FREE) ⭐

See [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) for complete step-by-step guide.

Quick summary:
```bash
1. Create MongoDB Atlas account (free)
2. Push code to GitHub
3. Connect GitHub to Render
4. Set environment variables
5. Deploy!
```

### Other Deployment Options

- [Docker Compose](RENDER_QUICK_START.md#option-b-docker-compose-local-development) - For local development
- [Heroku](RENDER_QUICK_START.md#option-c-heroku-deployment) - Alternative cloud platform
- [AWS](RENDER_QUICK_START.md#option-d-aws-deployment) - For advanced users
- [Manual Installation](RENDER_QUICK_START.md#option-a-manual-installation-for-development) - For development/testing

See [RENDER_QUICK_START.md](RENDER_QUICK_START.md) for additional deployment options.

## Project Structure

```
resumate/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   └── app/           # Redux configuration
│   └── package.json
├── server/                # Express backend
│   ├── controllers/       # Route controllers
│   ├── configs/           # Configuration files
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   └── middlewares/       # Express middlewares
├── render.yaml            # Render deployment config
├── docker-compose.yml     # Docker configuration
├── RENDER_DEPLOYMENT.md   # Detailed Render guide
├── RENDER_QUICK_START.md  # Quick reference
└── package.json           # Root package.json
```

## Available Scripts

### Development
```bash
npm run dev              # Start both client and server
npm run server           # Start server with nodemon
npm run client           # Start client development server
```

### Production
```bash
npm run build            # Build client for production
npm start                # Start server for production
```

### Installation
```bash
npm run install-all      # Install dependencies for both client and server
```

## API Documentation

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user

### Resume Management
- `POST /api/resumes/create` - Create new resume
- `GET /api/resumes/get/:resumeId` - Get resume details
- `PUT /api/resumes/update` - Update resume
- `DELETE /api/resumes/delete/:resumeId` - Delete resume
- `GET /api/resumes/public/:resumeId` - Get public resume

### AI Features
- `POST /api/ai/enhance-pro-sum` - Enhance professional summary
- `POST /api/ai/enhance-job-desc` - Enhance job description
- `POST /api/ai/upload-resume` - Upload and parse resume

## Configuration Files

- `render.yaml` - Render.com infrastructure configuration
- `docker-compose.yml` - Docker Compose setup for local development
- `.env.example` files - Environment variable templates
- `vite.config.js` - Client build configuration
- `.nodemonrc.json` - Development server configuration

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## Security

- All passwords are hashed with bcrypt
- JWT tokens expire in 7 days
- CORS is configured with specific origins
- Input validation on all API endpoints
- File uploads are validated (type and size)
- Sensitive data is not exposed in error messages

## Performance

- Optimized MongoDB queries with indexes
- Gzip compression enabled
- Static assets cached
- Database connection pooling
- Optimized React component rendering

## Troubleshooting

### Server won't start
```bash
# Clear node_modules and reinstall
rm -rf server/node_modules
cd server && npm install
npm start
```

### MongoDB connection error
```bash
# Check MongoDB is running
mongod

# Verify connection string in .env
# Format: mongodb://localhost:27017
```

### CORS error in browser
```bash
# Update CORS_ORIGIN in server/.env
CORS_ORIGIN=http://localhost:5173
```

### Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm start
```

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
1. Check existing [GitHub Issues](../../issues)
2. Create a new issue with detailed description
3. Include error messages and steps to reproduce

## Deployment Status

✅ **Production Ready** - Tested and optimized for production deployment

---

**Ready to deploy?** See [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) for step-by-step instructions!
