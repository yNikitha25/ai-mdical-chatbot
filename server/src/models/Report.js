const mongoose = require('mongoose')

const ReportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    filename: String,
    originalName: String,
    mimeType: String,
    path: String,
    cloudinaryUrl: String,
    ocrText: String,
    summary: String,
    predictions: [{ disease: String, confidence: Number }],
    analysis: String,
    solution: String,
    prescription: String,
    foodSuggestions: String,
  },
  { timestamps: true }
)

module.exports = mongoose.model('Report', ReportSchema)
