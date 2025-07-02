import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
const app = express()
const port = 5000
app.listen(port, () => {
  console.log('Website served on http://localhost:' + port)
})
mongoose.connect(process.env.MONGO).then(() => {
  console.log('Connected to Mongo DB')
}).catch((err) => { console.log(err) })
