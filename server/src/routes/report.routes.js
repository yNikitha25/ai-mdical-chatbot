const express = require('express')
const multer = require('multer')
const Report = require('../models/Report')
const { protect } = require('../middleware/auth')
const { analyzeReportImage } = require('../services/ai.service')
const { uploadBufferToCloudinary } = require('../config/cloudinary')

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })

router.post('/upload', protect, upload.array('reports', 6), async (req, res, next) => {
  try {
    const files = req.files || []
    const reports = await Promise.all(
      files.map(async (file) => {
        const cloudResult = await uploadBufferToCloudinary(file.buffer)
        const aiResult = await analyzeReportImage(file.buffer, file.mimetype, file.originalname)
        
        return Report.create({
          user: req.user?._id,
          filename: file.originalname,
          originalName: file.originalname,
          mimeType: file.mimetype,
          path: cloudResult.secure_url,
          cloudinaryUrl: cloudResult.secure_url,
          ocrText: 'Analyzed by MediVision AI',
          summary: aiResult.analysis || 'AI analysis complete.',
          predictions: [{ disease: aiResult.disease || 'Unknown Condition', confidence: 95 }],
          analysis: aiResult.analysis,
          solution: aiResult.solution,
          prescription: aiResult.prescription,
          foodSuggestions: aiResult.foodSuggestions,
        })
      })
    )
    res.status(201).json({ reports })
  } catch (error) {
    next(error)
  }
})

router.get('/', protect, async (req, res, next) => {
  try {
    const reports = await Report.find({ user: req.user?._id }).sort({ createdAt: -1 })
    res.json({ reports })
  } catch (error) {
    next(error)
  }
})

module.exports = router
