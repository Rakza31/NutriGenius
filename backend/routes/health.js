const express = require('express');
const HealthReport = require('../models/HealthReport');
const { auth } = require('../middleware/auth');
const { processHealthData } = require('../utils/wolfram-engine');

const router = express.Router();

// Submit health assessment
router.post('/assessment', auth, async (req, res) => {
  try {
    const {
      age,
      gender,
      height,
      weight,
      activityLevel,
      healthGoals,
      dietaryRestrictions,
      medicalConditions
    } = req.body;

    // Create health report
    const healthReport = new HealthReport({
      userId: req.userId,
      age,
      gender,
      height,
      weight,
      activityLevel,
      healthGoals,
      dietaryRestrictions,
      medicalConditions,
      date: new Date()
    });

    await healthReport.save();

    // Process health data with Wolfram Alpha
    const analysis = await processHealthData({
      age,
      gender,
      height,
      weight,
      activityLevel,
      healthGoals
    });

    // Update health report with analysis
    healthReport.analysis = analysis;
    await healthReport.save();

    res.status(201).json({
      message: 'Health assessment submitted successfully',
      reportId: healthReport._id,
      analysis
    });
  } catch (error) {
    console.error('Health assessment error:', error);
    res.status(500).json({ error: 'Server error during health assessment' });
  }
});

// Get user's latest health assessment
router.get('/latest', auth, async (req, res) => {
  try {
    const healthReport = await HealthReport.findOne({ userId: req.userId })
      .sort({ date: -1 })
      .populate('analysis');

    if (!healthReport) {
      return res.status(404).json({ error: 'No health assessment found' });
    }

    res.json({ healthReport });
  } catch (error) {
    console.error('Get latest health assessment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all health assessments for user
router.get('/assessments', auth, async (req, res) => {
  try {
    const healthReports = await HealthReport.find({ userId: req.userId })
      .sort({ date: -1 })
      .select('-analysis'); // Exclude detailed analysis for list view

    res.json({ healthReports });
  } catch (error) {
    console.error('Get health assessments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get specific health assessment
router.get('/assessment/:id', auth, async (req, res) => {
  try {
    const healthReport = await HealthReport.findOne({
      _id: req.params.id,
      userId: req.userId
    }).populate('analysis');

    if (!healthReport) {
      return res.status(404).json({ error: 'Health assessment not found' });
    }

    res.json({ healthReport });
  } catch (error) {
    console.error('Get health assessment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
