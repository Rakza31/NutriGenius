const express = require('express');
const HealthReport = require('../models/HealthReport');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all health assessments for user
router.get('/assessments', auth, async (req, res) => {
  try {
    const healthReports = await HealthReport.find({ userId: req.userId })
      .sort({ date: -1 })
      .select('date age weight healthGoals analysis.calories analysis.protein analysis.carbs analysis.fats');

    const formattedHistory = healthReports.map(report => ({
      id: report._id,
      date: report.date,
      age: report.age,
      weight: report.weight,
      goal: report.healthGoals,
      calories: report.analysis?.calories,
      protein: report.analysis?.protein,
      carbs: report.analysis?.carbs,
      fats: report.analysis?.fats,
      notes: report.analysis?.recommendations?.join(', ') || ''
    }));

    res.json(formattedHistory);
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get progress data for charts
router.get('/progress', auth, async (req, res) => {
  try {
    const { timeframe = '6months' } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    switch (timeframe) {
      case '1month':
        dateFilter = { date: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } };
        break;
      case '3months':
        dateFilter = { date: { $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) } };
        break;
      case '6months':
        dateFilter = { date: { $gte: new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000) } };
        break;
      case '1year':
        dateFilter = { date: { $gte: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000) } };
        break;
    }

    const healthReports = await HealthReport.find({ 
      userId: req.userId,
      ...dateFilter
    })
    .sort({ date: 1 })
    .select('date weight analysis.calories analysis.protein analysis.carbs analysis.fats');

    const progressData = {
      weight: healthReports.map(report => ({
        date: report.date,
        value: report.weight
      })),
      calories: healthReports.map(report => ({
        date: report.date,
        value: report.analysis?.calories
      })),
      macronutrients: healthReports.map(report => ({
        date: report.date,
        protein: report.analysis?.protein,
        carbs: report.analysis?.carbs,
        fats: report.analysis?.fats
      }))
    };

    res.json(progressData);
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get detailed history for specific assessment
router.get('/assessment/:id', auth, async (req, res) => {
  try {
    const healthReport = await HealthReport.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!healthReport) {
      return res.status(404).json({ error: 'Health assessment not found' });
    }

    res.json({ healthReport });
  } catch (error) {
    console.error('Get assessment details error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete health assessment
router.delete('/assessment/:id', auth, async (req, res) => {
  try {
    const healthReport = await HealthReport.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!healthReport) {
      return res.status(404).json({ error: 'Health assessment not found' });
    }

    res.json({ message: 'Health assessment deleted successfully' });
  } catch (error) {
    console.error('Delete assessment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
