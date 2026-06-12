const mongoose = require('mongoose')

const ConsultationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    symptoms: [String],
    messages: [{ role: String, text: String }],
    analysis: {
      diseases: [{ name: String, confidence: Number }],
      severity: String,
      affectedOrgans: [String],
      recoveryProbability: Number,
      riskIndicators: [String],
    },
    prescription: [{ medicine: String, dosage: String, timing: String, precautions: String }],
    foodPlan: [{ name: String, calories: Number, benefits: String, avoid: Boolean }],
  },
  { timestamps: true }
)

module.exports = mongoose.model('Consultation', ConsultationSchema)
