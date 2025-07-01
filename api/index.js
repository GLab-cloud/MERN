import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
mongoose.connect(process.env.MONGO)
const app = express()
const port = 5000
app.listen(port, () => {
  console.log('Website served on http://localhost:' + port)
})
