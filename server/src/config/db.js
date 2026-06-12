const mongoose = require('mongoose')

let dbState = {
  connected: false,
  name: null,
  host: null,
  message: 'MongoDB not initialized',
}

async function connectDB() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    dbState = { connected: false, name: null, host: null, message: 'MONGODB_URI not set' }
    console.warn('MONGODB_URI not set. API will run without database persistence.')
    return
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2500 })
    dbState = {
      connected: true,
      name: mongoose.connection.name,
      host: mongoose.connection.host,
      message: 'MongoDB connected',
    }
    console.log('MongoDB connected')
  } catch (error) {
    dbState = { connected: false, name: null, host: null, message: error.message }
    console.warn(`MongoDB connection skipped: ${error.message}`)
  }
}

mongoose.connection.on('connected', () => {
  dbState = {
    connected: true,
    name: mongoose.connection.name,
    host: mongoose.connection.host,
    message: 'MongoDB connected',
  }
})

mongoose.connection.on('disconnected', () => {
  dbState = { connected: false, name: null, host: null, message: 'MongoDB disconnected' }
})

function getDBStatus() {
  return dbState
}

module.exports = { connectDB, getDBStatus }
