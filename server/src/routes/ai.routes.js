const express = require('express')
const Consultation = require('../models/Consultation')
const { protect } = require('../middleware/auth')
const {
  analyzeSymptoms,
  buildConversationText,
  generateMedicalReply,
  generatePrescription,
} = require('../services/ai.service')

const router = express.Router()

router.post('/chat', async (req, res, next) => {
  try {
    const { message, history, language } = req.body
    const conversationText = buildConversationText([...(history || []), { role: 'user', text: message }])
    const reply = await generateMedicalReply(message, history, language)
    const analysis = analyzeSymptoms(conversationText)
    const prescription = generatePrescription(conversationText, analysis.symptoms)
    res.json({ reply, analysis, prescription })
  } catch (error) {
    next(error)
  }
})

router.post('/prescription', async (req, res) => {
  const conversationText = buildConversationText(req.body.messages || []) || req.body.message || req.body.symptoms || ''
  const analysis = analyzeSymptoms(conversationText)
  const prescription = generatePrescription(conversationText, analysis.symptoms)
  res.json({ prescription, analysis })
})

router.post('/analyze', async (req, res) => {
  const text = req.body.symptoms || req.body.message || ''
  res.json(analyzeSymptoms(text))
})

router.post('/consultations', protect, async (req, res, next) => {
  try {
    const analysis = analyzeSymptoms(req.body.summary || '')
    const consultation = await Consultation.create({
      user: req.user?._id,
      symptoms: analysis.symptoms,
      messages: req.body.messages || [],
      analysis,
    })
    res.status(201).json({ consultation })
  } catch (error) {
    next(error)
  }
})

module.exports = router
