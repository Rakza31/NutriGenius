const express = require('express');
const HealthReport = require('../models/HealthReport');
const { auth } = require('../middleware/auth');
const { 
  calculateNutrition, 
  generateMealPlan, 
  analyzeFood 
} = require('../utils/wolfram-engine');

const router = express.Router();

// Get nutrition results based on latest health assessment
router.get('/results', auth, async (req, res) => {
  try {
    const healthReport = await HealthReport.findOne({ userId: req.userId })
      .sort({ date: -1 });

    if (!healthReport) {
      return res.status(404).json({ error: 'No health assessment found' });
    }

    // Calculate nutrition requirements
    const nutritionData = await calculateNutrition({
      age: healthReport.age,
      gender: healthReport.gender,
      height: healthReport.height,
      weight: healthReport.weight,
      activityLevel: healthReport.activityLevel,
      healthGoals: healthReport.healthGoals
    });

    res.json(nutritionData);
  } catch (error) {
    console.error('Get nutrition results error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Generate meal plan
router.post('/meal-plan', auth, async (req, res) => {
  try {
    const { preferences, dietaryRestrictions } = req.body;

    const healthReport = await HealthReport.findOne({ userId: req.userId })
      .sort({ date: -1 });

    if (!healthReport) {
      return res.status(404).json({ error: 'No health assessment found' });
    }

    const mealPlan = await generateMealPlan({
      nutritionRequirements: healthReport.analysis,
      preferences,
      dietaryRestrictions: dietaryRestrictions || healthReport.dietaryRestrictions
    });

    res.json(mealPlan);
  } catch (error) {
    console.error('Generate meal plan error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Analyze food nutrition
router.post('/analyze', auth, async (req, res) => {
  try {
    const { foodItems } = req.body;

    if (!foodItems || !Array.isArray(foodItems)) {
      return res.status(400).json({ error: 'Food items array is required' });
    }

    const analysis = await analyzeFood(foodItems);

    res.json(analysis);
  } catch (error) {
    console.error('Analyze food error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get nutrition recommendations
router.get('/recommendations', auth, async (req, res) => {
  try {
    const healthReport = await HealthReport.findOne({ userId: req.userId })
      .sort({ date: -1 });

    if (!healthReport) {
      return res.status(404).json({ error: 'No health assessment found' });
    }

    // Generate recommendations based on health data
    const recommendations = {
      dailyCalories: healthReport.analysis?.calories || 2000,
      macronutrients: {
        protein: healthReport.analysis?.protein || 150,
        carbohydrates: healthReport.analysis?.carbs || 250,
        fats: healthReport.analysis?.fats || 65
      },
      micronutrients: healthReport.analysis?.micronutrients || {},
      recommendations: healthReport.analysis?.recommendations || []
    };

    res.json(recommendations);
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
