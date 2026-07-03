const jwt = require('jsonwebtoken')
const User = require('../models/User')

async function protect(req, res, next) {
  // Authentication completely bypassed as requested
  req.user = { _id: null }
  return next()
}

module.exports = { protect }
