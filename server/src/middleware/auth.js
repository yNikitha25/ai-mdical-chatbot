const jwt = require('jsonwebtoken')
const User = require('../models/User')

async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : req.cookies?.token
    if (!token) return res.status(401).json({ message: 'Authentication required' })

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'development-secret')
    req.user = await User.findById(decoded.id).select('-password')
    if (!req.user && decoded.id !== 'demo') return res.status(401).json({ message: 'Invalid token' })
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}

module.exports = { protect }
