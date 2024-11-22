import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config() 

const connectdb = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDB connected')
        
    } catch (error) {
        console.log('MongoDB connection error:', err);
    }
}

export default connectdb;

