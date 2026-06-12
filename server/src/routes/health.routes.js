const express = require('express')
const { protect } = require('../middleware/auth')
const { analyzeSymptoms, generatePrescription } = require('../services/ai.service')

const router = express.Router()

router.get('/dashboard', protect, (_req, res) => {
  res.json({
    healthScore: 91,
    activeSymptoms: ['fever', 'headache', 'cough'],
    heartRate: 72,
    waterIntake: 2.1,
    sleep: '7h 40m',
    reminders: ['Hydration target', 'Doctor review if fever persists', 'Upload CBC report'],
    timeline: [
      { day: 'Mon', score: 62 },
      { day: 'Tue', score: 68 },
      { day: 'Wed', score: 72 },
      { day: 'Thu', score: 76 },
      { day: 'Fri', score: 81 },
      { day: 'Sat', score: 86 },
      { day: 'Sun', score: 91 },
    ],
  })
})

router.post('/prescription', protect, (req, res) => {
  const text = req.body.message || req.body.symptoms || ''
  const analysis = analyzeSymptoms(text)
  const prescription = generatePrescription(text, analysis.symptoms)
  res.json(prescription)
})

router.get('/food', protect, (_req, res) => {
  res.json({
    eat: ['soup', 'coconut water', 'fruits', 'warm liquids', 'fiber-rich foods'],
    avoid: ['oily foods', 'high sugar drinks', 'alcohol', 'heavy meals'],
  })
})

module.exports = router
