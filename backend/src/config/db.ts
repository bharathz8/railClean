import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDb = async () => {
    try{
        await mongoose.connect(`mongodb://localhost:27017/rail`);
        console.log("database running successfully");
    } catch (e) {
        console.error(e);
    }
}

export default connectDb;