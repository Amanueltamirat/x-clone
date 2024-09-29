import mongoose from "mongoose";

const mongoDbConnection = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`mongoDb connected at:${conn.connection.host}`)
        
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}

export default mongoDbConnection