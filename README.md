# TAPP - Creator & Brand Collaboration Platform

A privacy-first platform enabling creators, brands, and fans to collaborate meaningfully with data-driven insights.

## 🚀 Features

### For Creators
- **Analytics Dashboard**: View YouTube channel and video performance
- **AI Insights**: Analyze comments for sentiment, themes, and content suggestions
- **Project Crowdfunding**: Launch projects and get funded by your audience
- **Brand Discovery**: Get discovered by brands looking for collaborations
- **Profile Management**: Showcase your work and connect social accounts

### For Brands
- **Creator Discovery**: Find creators by genre, region, engagement, and more
- **Compatibility Scoring**: Data-driven matching with creators
- **Investment Opportunities**: Support creator projects

### For Fans
- **Project Investment**: Invest in your favorite creators' projects
- **Revenue Sharing**: Earn returns based on project success
- **Community Engagement**: Be part of the creative process

## 📋 Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.10+)
- **Database**: MongoDB (Motor for async)
- **Queue**: Redis + RQ
- **Auth**: JWT (access + refresh tokens)
- **Social**: YouTube OAuth (mock for now)

### Frontend
- **Framework**: React + Vite
- **UI**: shadcn/ui + Tailwind CSS
- **State**: React Query
- **Routing**: React Router

## 🛠️ Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 16+
- MongoDB (local or Atlas)
- Redis (optional, for AI workers)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd c:\Users\coolg\Desktop\hatch
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set environment variables** (optional)
   Create a `.env` file:
   ```env
   MONGODB_URL=mongodb://localhost:27017
   DB_NAME=tapp_db
   SECRET_KEY=your-secret-key-here
   REDIS_URL=redis://localhost:6379
   ```

4. **Seed the database**
   ```bash
   python seed.py
   ```

5. **Run the backend**
   ```bash
   python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```

   The API will be available at: http://localhost:8000
   API docs: http://localhost:8000/docs

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd tapp-creator-hub-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set environment variables**
   Create `.env.local`:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

4. **Run the frontend**
   ```bash
   npm run dev
   ```

   The app will be available at: http://localhost:5173

## 🧪 Testing the Platform

### Test Accounts (from seed.py)
- **Email**: `user0@example.com` through `user9@example.com`
- **Password**: `password`
- **Roles**: Random mix of CREATOR, BRAND, FAN

### Test Flows

1. **Login Flow**
   - Go to http://localhost:5173/login
   - Login with test account or register new one
   - You'll be redirected to the home page

2. **Creator Flow**
   - Login as a CREATOR
   - Go to Profile → Edit your profile
   - Go to Projects → Create a new project
   - View Analytics (mock data from seed)

3. **Fan Flow**
   - Login as a FAN
   - Go to Projects → View available projects
   - Invest in a project
   - View your investments

4. **Discovery Flow**
   - Go to Community
   - Search and filter creators
   - View creator profiles

## 📁 Project Structure

### Backend (`/app`)
```
app/
├── main.py                 # FastAPI app entry point
├── config/
│   └── settings.py        # Configuration
├── db/
│   └── mongo.py           # MongoDB connection
├── auth/                  # Authentication
├── creators/              # Creator profiles
├── brands/                # Brand profiles
├── social/                # Social OAuth
├── analytics/             # Analytics endpoints
├── ai_insights/           # AI analysis
├── discover/              # Discovery & search
├── projects/              # Crowdfunding
├── investments/           # Investment tracking
├── compatibility/         # Matching scores
├── workers/               # Background jobs
└── utils/                 # Utilities
```

### Frontend (`/tapp-creator-hub-main/src`)
```
src/
├── pages/                 # Page components
│   ├── Login.tsx
│   ├── Profile.tsx
│   ├── Projects.tsx
│   ├── Community.tsx
│   ├── Analytics.tsx
│   └── Feedback.tsx
├── components/            # Reusable components
├── lib/
│   └── api.ts            # API client
├── hooks/
│   └── useAPI.ts         # API hooks
└── App.tsx               # Main app
```

## 🔑 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `GET /auth/me` - Get current user
- `POST /auth/refresh` - Refresh token

### Creators
- `GET /creators/me` - Get my creator profile
- `PUT /creators/me` - Update my profile
- `GET /creators/{id}` - Get creator by ID

### Projects
- `POST /projects` - Create project
- `GET /projects` - List all projects
- `GET /projects/{id}` - Get project details
- `POST /projects/{id}/invest` - Invest in project
- `POST /projects/{id}/revenue-report` - Add revenue report

### Discovery
- `GET /discover/creators` - Search creators (with filters)
- `GET /discover/brands` - Search brands

### AI Insights
- `GET /ai/available-queries` - Get query templates
- `GET /ai/available-videos` - Get videos for analysis
- `POST /ai/comment-analysis` - Create analysis job
- `GET /ai/jobs/{id}` - Get job status
- `POST /ai/chat` - Chat with AI about insights

### Analytics
- `GET /analytics/creator/{id}` - Get creator analytics
- `GET /analytics/video/{id}` - Get video analytics

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt for password storage
- **CORS Protection**: Configured for local development
- **Role-Based Access**: Different permissions for CREATOR/BRAND/FAN
- **Privacy-First**: AI processing doesn't store raw content

## 🚧 Current Limitations (Mock Features)

The following features are currently mocked but fully functional:

1. **YouTube OAuth**: Returns mock tokens (no real Google integration)
2. **AI Analysis**: Returns mock sentiment/themes (no real LLM)
3. **Payment Processing**: Records investments but no real payments
4. **Social Data Sync**: Uses seed data instead of real YouTube API

## 🎯 Next Steps for Production

1. **Real Integrations**
   - Integrate OpenAI/Anthropic for AI insights
   - Add YouTube API credentials for real OAuth
   - Integrate payment gateway (Stripe/Razorpay)

2. **Enhanced Features**
   - Add Instagram/TikTok support
   - Implement real-time notifications
   - Add chat/messaging between users
   - Build admin dashboard

3. **DevOps**
   - Set up CI/CD pipeline
   - Deploy to cloud (AWS/GCP/Azure)
   - Add monitoring (Sentry, DataDog)
   - Set up staging environment

4. **Testing**
   - Write unit tests (pytest)
   - Add integration tests
   - E2E tests (Playwright)

## 📝 License

MIT

## 🤝 Contributing

This is a demo/MVP project. For production use, please implement:
- Real OAuth flows
- Actual payment processing
- Production-grade security
- Comprehensive testing
- Error handling
- Rate limiting
- Caching

## 📞 Support

For issues or questions, please check:
- API Documentation: http://localhost:8000/docs
- Frontend: http://localhost:5173

---

**Built with ❤️ for the creator economy**
