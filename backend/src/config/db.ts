import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDb = async () => {
    try{
        await mongoose.connect(`mongodb+srv://admin:kkJwyBt61qwGg9mN@cluster0.uc6hspy.mongodb.net/rail`);
        console.log("database running successfully");
    } catch (e) {
        console.error(e);
    }
}

export default connectDb;