const jwt = require('jsonwebtoken')

function signToken(user) {
  return jwt.sign({ id: user._id || 'demo', email: user.email }, process.env.JWT_SECRET || 'development-secret', {
    expiresIn: '7d',
  })
}

module.exports = { signToken }
