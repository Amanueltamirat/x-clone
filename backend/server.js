import express from 'express'
import path from 'path'
import authRoute from './routes/auth.routes.js'
import dotenv from 'dotenv'
import mongoDbConnection from './db/db.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRoute from './routes/user.route.js'
import {v2 as cloudinary} from 'cloudinary'
import postRoute from './routes/post.route.js'
import notificationRoute from './routes/notification.route.js'


dotenv.config()

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
})

const PORT = process.env.PORT || 5000
const app = express()
const __dirname = path.resolve()

app.use(express.urlencoded({extended:true}))
app.use(cors());
app.use(express.json({limit:'5mb'}))
app.use(cookieParser())

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/posts', postRoute);
app.use('/api/notification', notificationRoute)

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(PORT,()=>{
    console.log('Listening at port:',PORT)
    mongoDbConnection()
})