# 🧠 NutriGenius - Smart Nutrition Advisor

**NutriGenius** is your personal nutrition advisor powered by advanced algorithms and Wolfram Language. It analyzes your health metrics, blood work, lifestyle, and dietary preferences to provide scientifically personalized diet and health guidance.

![NutriGenius Logo](https://img.shields.io/badge/NutriGenius-Smart%20Nutrition%20Advisor-blue?style=for-the-badge&logo=health)

## 🌟 Features

### 🔐 **User Authentication**
- Secure login and registration system
- JWT-based authentication
- Password hashing with bcrypt
- Session management

### 📊 **Health Assessment**
- Comprehensive health form for personalized recommendations
- BMI, BMR, and TDEE calculations
- Activity level and health goal tracking
- Medical conditions and dietary restrictions

### 🧮 **Advanced Nutrition Analysis**
- Wolfram Alpha API integration for scientific calculations
- Real-time nutrition analysis
- Macronutrient and micronutrient breakdown
- Personalized calorie recommendations

### 🍽️ **AI-Powered Meal Planning**
- Intelligent meal suggestions based on health data
- Dietary restriction compliance
- Nutritional balance optimization
- Weekly meal planning

### 📈 **Progress Tracking**
- Historical data visualization
- Progress charts and analytics
- Health trend analysis
- Goal achievement tracking

### 📊 **Interactive Dashboards**
- Visual representation of nutrition data
- Real-time health insights
- Comparative analysis
- Export capabilities

## 🛠️ Technology Stack

### **Frontend**
- **React.js** - Modern UI framework
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Responsive Design** - Mobile-first approach

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

### **Wolfram Language Integration**
- **Nutrition Calculations** (`nutrition-calculations.wl`)
- **Health Insights** (`health-insights.wl`)
- **Meal Planning** (`meal-planning.wl`)
- **Chart Generation** (`chart-generation.wl`)
- **Data Processing** (`data-processing.wl`)

## 🚀 Getting Started

### **Prerequisites**
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Wolfram Alpha API key
- Git

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rakza31/NutriGenius.git
   cd NutriGenius
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Environment Setup**
   Create a `.env` file in the backend directory:
   ```env
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/nutrition-advisor
   
   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key-here
   
   # Wolfram Alpha API
   WOLFRAM_APP_ID=your-wolfram-alpha-app-id
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

5. **Start Development Servers**
   
   **Backend Server:**
   ```bash
   cd backend
   npm run dev
   ```
   
   **Frontend Server:**
   ```bash
   cd frontend
   npm start
   ```

## 📁 Project Structure

```
NutriGenius/
├── frontend/                 # React.js Frontend
│   ├── public/              # Static assets
│   │   ├── index.html       # Main HTML template
│   │   └── favicon.ico      # App icon
│   ├── src/                 # Source code
│   │   ├── components/      # React components
│   │   │   ├── Login.js     # Authentication
│   │   │   ├── Home.js      # Dashboard
│   │   │   ├── HealthForm.js # Health assessment
│   │   │   ├── Results.js   # Nutrition results
│   │   │   └── History.js   # Progress tracking
│   │   ├── styles/          # CSS styles
│   │   │   └── main.css     # Tailwind imports
│   │   ├── utils/           # Utilities
│   │   │   └── api.js       # API communication
│   │   └── App.js           # Main app component
│   ├── package.json         # Frontend dependencies
│   └── tailwind.config.js   # Tailwind configuration
├── backend/                 # Node.js Backend
│   ├── routes/              # API routes
│   │   ├── auth.js          # Authentication endpoints
│   │   ├── health.js        # Health assessment endpoints
│   │   ├── nutrition.js     # Nutrition analysis endpoints
│   │   └── history.js       # History endpoints
│   ├── models/              # Database models
│   │   ├── User.js          # User model
│   │   └── HealthReport.js  # Health report model
│   ├── middleware/          # Custom middleware
│   │   └── auth.js          # JWT authentication
│   ├── config/              # Configuration
│   │   └── database.js      # MongoDB connection
│   ├── utils/               # Utilities
│   │   └── wolfram-engine.js # Wolfram Alpha integration
│   ├── wolfram/             # Wolfram Language files
│   │   ├── nutrition-calculations.wl
│   │   ├── health-insights.wl
│   │   ├── meal-planning.wl
│   │   ├── chart-generation.wl
│   │   └── data-processing.wl
│   ├── package.json         # Backend dependencies
│   └── server.js            # Main server file
└── README.md                # Project documentation
```

## 🔧 API Endpoints

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### **Health Assessment**
- `POST /api/health/assessment` - Submit health assessment
- `GET /api/health/latest` - Get latest assessment
- `GET /api/health/assessments` - Get all assessments
- `GET /api/health/assessment/:id` - Get specific assessment

### **Nutrition Analysis**
- `GET /api/nutrition/results` - Get nutrition results
- `POST /api/nutrition/meal-plan` - Generate meal plan
- `POST /api/nutrition/analyze` - Analyze food nutrition
- `GET /api/nutrition/recommendations` - Get recommendations

### **History & Progress**
- `GET /api/history/assessments` - Get assessment history
- `GET /api/history/progress` - Get progress data
- `GET /api/history/assessment/:id` - Get specific assessment
- `DELETE /api/history/assessment/:id` - Delete assessment

## 🧪 Wolfram Language Modules

### **Nutrition Calculations** (`nutrition-calculations.wl`)
- BMI, BMR, and TDEE calculations
- Macronutrient distribution
- Calorie requirements
- Nutrition recommendations

### **Health Insights** (`health-insights.wl`)
- Health risk analysis
- Personalized insights
- Health score calculation
- Improvement suggestions

### **Meal Planning** (`meal-planning.wl`)
- Breakfast, lunch, dinner generation
- Snack recommendations
- Weekly meal plans
- Dietary restriction compliance

### **Chart Generation** (`chart-generation.wl`)
- Nutrition pie charts
- Progress line charts
- BMI tracking
- Calorie distribution

### **Data Processing** (`data-processing.wl`)
- Health data validation
- Data cleaning and normalization
- Trend analysis
- Aggregation functions

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt with configurable rounds
- **Rate Limiting** - API request throttling
- **CORS Protection** - Cross-origin request security
- **Helmet.js** - Security headers
- **Input Validation** - Data sanitization
- **Environment Variables** - Secure configuration management

## 📊 Database Schema

### **User Model**
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  profile: {
    age: Number,
    gender: String,
    height: Number,
    weight: Number,
    activityLevel: String,
    healthGoals: String,
    dietaryRestrictions: [String],
    medicalConditions: [String]
  },
  preferences: {
    theme: String,
    notifications: Boolean
  },
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### **Health Report Model**
```javascript
{
  userId: ObjectId,
  age: Number,
  gender: String,
  height: Number,
  weight: Number,
  activityLevel: String,
  healthGoals: String,
  dietaryRestrictions: String,
  medicalConditions: String,
  analysis: {
    bmi: Number,
    bmr: Number,
    tdee: Number,
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number,
    micronutrients: Object,
    recommendations: [String],
    mealSuggestions: Object,
    healthInsights: [String]
  },
  status: String,
  processedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Deployment

### **Frontend Deployment**
```bash
cd frontend
npm run build
# Deploy build/ folder to your hosting service
```

### **Backend Deployment**
```bash
cd backend
npm start
# Deploy to your server or cloud platform
```

### **Environment Variables for Production**
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
WOLFRAM_APP_ID=your-wolfram-alpha-app-id
FRONTEND_URL=https://your-frontend-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Wolfram Alpha** - For providing advanced computational capabilities
- **React.js** - For the amazing frontend framework
- **Node.js** - For the robust backend runtime
- **MongoDB** - For the flexible database solution
- **Tailwind CSS** - For the utility-first CSS framework

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact the development team
- Check the documentation

---

**Made with ❤️ by the NutriGenius Team**

*Empowering healthier lives through intelligent nutrition guidance*
