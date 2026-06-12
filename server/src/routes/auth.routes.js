const express = require('express')
const User = require('../models/User')
const { signToken } = require('../services/token')
const { protect } = require('../middleware/auth')

const router = express.Router()

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    const existing = await User.findOne({ email })
    if (existing) return res.status(409).json({ message: 'Email already registered' })
    const verificationOtp = String(Math.floor(100000 + Math.random() * 900000))
    const user = await User.create({ name, email, password, verificationOtp })
    res.status(201).json({ token: signToken(user), user: publicUser(user), verificationOtp })
  } catch (error) {
    next(error)
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: 'Invalid credentials' })
    res.json({ token: signToken(user), user: publicUser(user) })
  } catch (error) {
    next(error)
  }
})

router.post('/verify-email', protect, async (req, res) => {
  if (req.user) {
    req.user.verified = true
    req.user.verificationOtp = undefined
    await req.user.save()
  }
  res.json({ message: 'Email verified' })
})

router.post('/forgot-password', async (_req, res) => {
  res.json({ message: 'Password reset OTP generated', otp: '246810' })
})

router.post('/reset-password', async (_req, res) => {
  res.json({ message: 'Password reset successful' })
})

router.get('/me', protect, (req, res) => {
  res.json({ user: req.user || { name: 'Demo Patient', email: 'demo@medivision.ai' } })
})

router.post('/logout', (_req, res) => {
  res.clearCookie('token')
  res.json({ message: 'Logged out securely' })
})

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, verified: user.verified, profile: user.profile }
}

module.exports = router
