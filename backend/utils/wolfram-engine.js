const wa = require('wolfram-alpha-node');

// Initialize Wolfram Alpha API
const wolfram = wa(process.env.WOLFRAM_APP_ID);

/**
 * Process health data and get nutrition calculations
 */
const processHealthData = async (healthData) => {
  try {
    const { age, gender, height, weight, activityLevel, healthGoals } = healthData;

    // Calculate BMI
    const bmiQuery = `BMI for ${weight} kg and ${height} cm`;
    const bmiResult = await wolfram.getShort(bmiQuery);

    // Calculate BMR (Basal Metabolic Rate)
    const bmrQuery = `BMR calculation ${gender} ${age} years ${weight} kg ${height} cm`;
    const bmrResult = await wolfram.getShort(bmrQuery);

    // Calculate TDEE (Total Daily Energy Expenditure)
    const tdeeQuery = `TDEE calculation ${bmrResult} calories ${activityLevel} activity level`;
    const tdeeResult = await wolfram.getShort(tdeeQuery);

    // Get nutrition recommendations
    const nutritionQuery = `daily nutrition requirements ${tdeeResult} calories ${healthGoals} goal`;
    const nutritionResult = await wolfram.getShort(nutritionQuery);

    return {
      bmi: parseFloat(bmiResult) || null,
      bmr: parseFloat(bmrResult) || null,
      tdee: parseFloat(tdeeResult) || null,
      calories: parseFloat(tdeeResult) || 2000,
      recommendations: [nutritionResult] || []
    };
  } catch (error) {
    console.error('Wolfram Alpha health data processing error:', error);
    // Return fallback calculations
    return calculateFallbackNutrition(healthData);
  }
};

/**
 * Calculate nutrition requirements
 */
const calculateNutrition = async (healthData) => {
  try {
    const { age, gender, height, weight, activityLevel, healthGoals } = healthData;

    // Calculate macronutrient distribution
    const macroQuery = `macronutrient distribution ${healthGoals} goal ${activityLevel} activity`;
    const macroResult = await wolfram.getShort(macroQuery);

    // Get protein requirements
    const proteinQuery = `protein requirements ${weight} kg body weight ${activityLevel} activity`;
    const proteinResult = await wolfram.getShort(proteinQuery);

    // Get carbohydrate requirements
    const carbQuery = `carbohydrate requirements ${activityLevel} activity level`;
    const carbResult = await wolfram.getShort(carbQuery);

    // Get fat requirements
    const fatQuery = `fat requirements daily nutrition`;
    const fatResult = await wolfram.getShort(fatQuery);

    return {
      calories: 2000, // Default, will be calculated by TDEE
      protein: parseFloat(proteinResult) || 150,
      carbs: parseFloat(carbResult) || 250,
      fats: parseFloat(fatResult) || 65,
      macronutrients: macroResult || 'Balanced macronutrient distribution'
    };
  } catch (error) {
    console.error('Wolfram Alpha nutrition calculation error:', error);
    return calculateFallbackNutrition(healthData);
  }
};

/**
 * Generate meal plan
 */
const generateMealPlan = async (requirements) => {
  try {
    const { nutritionRequirements, preferences, dietaryRestrictions } = requirements;

    // Generate breakfast
    const breakfastQuery = `healthy breakfast ideas ${nutritionRequirements.calories * 0.25} calories ${dietaryRestrictions}`;
    const breakfastResult = await wolfram.getShort(breakfastQuery);

    // Generate lunch
    const lunchQuery = `healthy lunch ideas ${nutritionRequirements.calories * 0.35} calories ${dietaryRestrictions}`;
    const lunchResult = await wolfram.getShort(lunchQuery);

    // Generate dinner
    const dinnerQuery = `healthy dinner ideas ${nutritionRequirements.calories * 0.30} calories ${dietaryRestrictions}`;
    const dinnerResult = await wolfram.getShort(dinnerQuery);

    // Generate snacks
    const snackQuery = `healthy snack ideas ${nutritionRequirements.calories * 0.10} calories ${dietaryRestrictions}`;
    const snackResult = await wolfram.getShort(snackQuery);

    return {
      meals: {
        breakfast: breakfastResult || 'Oatmeal with berries and nuts',
        lunch: lunchResult || 'Grilled chicken salad with quinoa',
        dinner: dinnerResult || 'Salmon with roasted vegetables',
        snacks: [snackResult] || ['Greek yogurt with almonds']
      },
      totalCalories: nutritionRequirements.calories,
      macronutrients: nutritionRequirements
    };
  } catch (error) {
    console.error('Wolfram Alpha meal plan generation error:', error);
    return generateFallbackMealPlan(requirements);
  }
};

/**
 * Analyze food nutrition
 */
const analyzeFood = async (foodItems) => {
  try {
    const analyses = [];

    for (const food of foodItems) {
      const query = `nutrition facts ${food.name} ${food.quantity || '1 serving'}`;
      const result = await wolfram.getShort(query);

      analyses.push({
        food: food.name,
        quantity: food.quantity || '1 serving',
        nutrition: result || 'Nutrition information not available'
      });
    }

    return {
      analyses,
      totalNutrition: 'Combined nutrition analysis available'
    };
  } catch (error) {
    console.error('Wolfram Alpha food analysis error:', error);
    return {
      analyses: foodItems.map(food => ({
        food: food.name,
        quantity: food.quantity || '1 serving',
        nutrition: 'Nutrition analysis temporarily unavailable'
      })),
      totalNutrition: 'Analysis temporarily unavailable'
    };
  }
};

/**
 * Get health insights
 */
const getHealthInsights = async (healthData) => {
  try {
    const { age, gender, height, weight, activityLevel, healthGoals } = healthData;

    const query = `health insights ${age} years ${gender} ${weight} kg ${height} cm ${activityLevel} activity ${healthGoals} goal`;
    const result = await wolfram.getShort(query);

    return {
      insights: [result] || ['Maintain a balanced diet and regular exercise'],
      recommendations: ['Consult with a healthcare professional for personalized advice']
    };
  } catch (error) {
    console.error('Wolfram Alpha health insights error:', error);
    return {
      insights: ['Maintain a balanced diet and regular exercise'],
      recommendations: ['Consult with a healthcare professional for personalized advice']
    };
  }
};

/**
 * Generate charts and visualizations
 */
const generateCharts = async (data) => {
  try {
    const { type, data: chartData } = data;

    let query;
    switch (type) {
      case 'nutrition':
        query = `nutrition chart ${chartData.calories} calories ${chartData.protein}g protein ${chartData.carbs}g carbs ${chartData.fats}g fats`;
        break;
      case 'progress':
        query = `progress chart weight ${chartData.weight} kg over time`;
        break;
      default:
        query = `health data visualization ${JSON.stringify(chartData)}`;
    }

    const result = await wolfram.getShort(query);

    return {
      chartData: result || 'Chart data generated',
      type: type,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Wolfram Alpha chart generation error:', error);
    return {
      chartData: 'Chart generation temporarily unavailable',
      type: data.type,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Fallback nutrition calculations when Wolfram Alpha is unavailable
 */
const calculateFallbackNutrition = (healthData) => {
  const { age, gender, height, weight, activityLevel, healthGoals } = healthData;

  // Calculate BMR using Mifflin-St Jeor Equation
  let bmr;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // Calculate TDEE
  const activityMultipliers = {
    'sedentary': 1.2,
    'light': 1.375,
    'moderate': 1.55,
    'active': 1.725,
    'very-active': 1.9
  };

  const tdee = bmr * (activityMultipliers[activityLevel] || 1.2);

  // Adjust for health goals
  let calories = tdee;
  switch (healthGoals) {
    case 'weight-loss':
      calories = tdee - 500;
      break;
    case 'weight-gain':
      calories = tdee + 500;
      break;
    case 'muscle-gain':
      calories = tdee + 300;
      break;
  }

  // Calculate macronutrients
  const protein = weight * 2.2; // 1g per lb of body weight
  const fats = calories * 0.25 / 9; // 25% of calories from fat
  const carbs = (calories - (protein * 4) - (fats * 9)) / 4;

  return {
    bmi: (weight / ((height / 100) ** 2)).toFixed(1),
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    calories: Math.round(calories),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fats: Math.round(fats),
    recommendations: ['Maintain a balanced diet with regular exercise']
  };
};

/**
 * Fallback meal plan generation
 */
const generateFallbackMealPlan = (requirements) => {
  return {
    meals: {
      breakfast: 'Oatmeal with berries and nuts (400 calories)',
      lunch: 'Grilled chicken salad with quinoa (500 calories)',
      dinner: 'Salmon with roasted vegetables (600 calories)',
      snacks: ['Greek yogurt with almonds (200 calories)']
    },
    totalCalories: requirements.nutritionRequirements?.calories || 2000,
    macronutrients: requirements.nutritionRequirements || {}
  };
};

module.exports = {
  processHealthData,
  calculateNutrition,
  generateMealPlan,
  analyzeFood,
  getHealthInsights,
  generateCharts
};
