const mongoose = require('mongoose');

const healthReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Basic Information
  age: {
    type: Number,
    required: true,
    min: 1,
    max: 120
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'other']
  },
  height: {
    type: Number,
    required: true,
    min: 50,
    max: 300 // in cm
  },
  weight: {
    type: Number,
    required: true,
    min: 10,
    max: 500 // in kg
  },
  // Activity and Goals
  activityLevel: {
    type: String,
    required: true,
    enum: ['sedentary', 'light', 'moderate', 'active', 'very-active']
  },
  healthGoals: {
    type: String,
    required: true,
    enum: ['weight-loss', 'weight-gain', 'maintain', 'muscle-gain', 'general-health']
  },
  // Health Information
  dietaryRestrictions: {
    type: String,
    default: ''
  },
  medicalConditions: {
    type: String,
    default: ''
  },
  // Analysis Results (from Wolfram Alpha)
  analysis: {
    // Basic Calculations
    bmi: Number,
    bmr: Number, // Basal Metabolic Rate
    tdee: Number, // Total Daily Energy Expenditure
    
    // Macronutrients
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number,
    
    // Micronutrients
    micronutrients: {
      vitamins: {
        vitaminA: Number,
        vitaminC: Number,
        vitaminD: Number,
        vitaminE: Number,
        vitaminK: Number,
        thiamine: Number,
        riboflavin: Number,
        niacin: Number,
        vitaminB6: Number,
        folate: Number,
        vitaminB12: Number
      },
      minerals: {
        calcium: Number,
        iron: Number,
        magnesium: Number,
        phosphorus: Number,
        potassium: Number,
        sodium: Number,
        zinc: Number,
        copper: Number,
        manganese: Number,
        selenium: Number
      }
    },
    
    // Recommendations
    recommendations: [String],
    mealSuggestions: {
      breakfast: String,
      lunch: String,
      dinner: String,
      snacks: [String]
    },
    
    // Health Insights
    healthInsights: [String],
    riskFactors: [String],
    improvements: [String]
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'error'],
    default: 'pending'
  },
  
  // Processing Information
  processedAt: Date,
  processingTime: Number, // in milliseconds
  
  // Additional Notes
  notes: String
}, {
  timestamps: true
});

// Indexes for better query performance
healthReportSchema.index({ userId: 1, date: -1 });
healthReportSchema.index({ status: 1 });
healthReportSchema.index({ createdAt: -1 });

// Virtual for BMI calculation
healthReportSchema.virtual('calculatedBMI').get(function() {
  if (this.height && this.weight) {
    const heightInMeters = this.height / 100;
    return (this.weight / (heightInMeters * heightInMeters)).toFixed(1);
  }
  return null;
});

// Virtual for BMI category
healthReportSchema.virtual('bmiCategory').get(function() {
  const bmi = this.calculatedBMI;
  if (!bmi) return null;
  
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
});

// Method to calculate BMR (Basal Metabolic Rate)
healthReportSchema.methods.calculateBMR = function() {
  if (!this.age || !this.height || !this.weight || !this.gender) {
    return null;
  }
  
  if (this.gender === 'male') {
    return 88.362 + (13.397 * this.weight) + (4.799 * this.height) - (5.677 * this.age);
  } else {
    return 447.593 + (9.247 * this.weight) + (3.098 * this.height) - (4.330 * this.age);
  }
};

// Method to calculate TDEE (Total Daily Energy Expenditure)
healthReportSchema.methods.calculateTDEE = function() {
  const bmr = this.calculateBMR();
  if (!bmr) return null;
  
  const activityMultipliers = {
    'sedentary': 1.2,
    'light': 1.375,
    'moderate': 1.55,
    'active': 1.725,
    'very-active': 1.9
  };
  
  return bmr * (activityMultipliers[this.activityLevel] || 1.2);
};

// Pre-save middleware to calculate basic metrics
healthReportSchema.pre('save', function(next) {
  if (this.isModified('height') || this.isModified('weight') || this.isModified('age') || this.isModified('gender') || this.isModified('activityLevel')) {
    this.analysis.bmi = parseFloat(this.calculatedBMI);
    this.analysis.bmr = this.calculateBMR();
    this.analysis.tdee = this.calculateTDEE();
  }
  next();
});

// Method to get summary
healthReportSchema.methods.getSummary = function() {
  return {
    id: this._id,
    date: this.date,
    age: this.age,
    weight: this.weight,
    bmi: this.analysis.bmi,
    bmiCategory: this.bmiCategory,
    calories: this.analysis.calories,
    goal: this.healthGoals,
    status: this.status
  };
};

module.exports = mongoose.model('HealthReport', healthReportSchema);
