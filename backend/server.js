import express from 'express'
import authRoute from './routes/auth.routes.js'
import dotenv from 'dotenv'
import mongoDbConnection from './db/db.js'
dotenv.config()

const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())

app.use('/api/auth', authRoute)

app.listen(PORT,()=>{
    console.log('Listening at port 8008')
    mongoDbConnection()
})