import express from 'express'
import authRoute from './routes/auth.routes.js'
import dotenv from 'dotenv'
import mongoDbConnection from './db/db.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

dotenv.config()

const PORT = process.env.PORT || 5000
const app = express()
app.use(express.urlencoded({extended:true}))
app.use(cors());
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoute)

app.listen(PORT,()=>{
    console.log('Listening at port 8008')
    mongoDbConnection()
})