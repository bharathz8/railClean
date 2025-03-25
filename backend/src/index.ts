import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes"
import connectDb from "./config/db";
import dotenv from "dotenv";
import taskController from "./controllers/taskController"

dotenv.config();

console.log(process.env.JWT_SECRET);

const app = express();
connectDb();

app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
  });
  
app.use(express.json());

app.use("/", userRoutes);
app.use("/", taskController)

app.listen(3000, () => console.log("port successfully running"));