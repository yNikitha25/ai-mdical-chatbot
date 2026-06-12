const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    verified: { type: Boolean, default: false },
    verificationOtp: String,
    resetOtp: String,
    profile: {
      age: Number,
      gender: String,
      bloodGroup: String,
      allergies: [String],
      medicalHistory: [String],
      emergencyContacts: [String],
      avatarUrl: String,
    },
  },
  { timestamps: true }
)

UserSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

UserSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password)
}

module.exports = mongoose.model('User', UserSchema)
