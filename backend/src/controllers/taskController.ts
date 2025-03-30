import express, { Request, Response, NextFunction } from "express";
import Task from "../models/taskModel";
import User from "../models/userModel";
import { authMiddleware, adminMiddleware } from "../middlewares/authMiddlewares";
import { AuthRequest } from "../types/types";
import moment from "moment";
const router = express.Router();

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => 
    (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };

router.post(
    "/create-task", 
    authMiddleware, 
    adminMiddleware, 
    asyncHandler(async (req: AuthRequest, res: Response) => {
        let { title, junction, label, assignedTo, time, notes, train } = req.body;

        const formattedTime = moment(time, "YYYY-MM-DDTHH:mm").toDate();

        const newTask = new Task({
            title,
            junction,
            train,
            label,
            assignedTo,
            time: formattedTime,
            status: "pending",
            notes
        });

        await newTask.save();
        res.status(201).json({ message: "Task created successfully", task: newTask });
    })
);

router.get(
    "/my-tasks", 
    authMiddleware, 
    asyncHandler(async (req: AuthRequest, res: Response) => {
        const tasks = await Task.find({ assignedTo: req.user?.id });
        res.status(200).json(tasks);
    })
);

router.get("/tasks", authMiddleware, adminMiddleware, asyncHandler(async (req: AuthRequest, res: Response) => {
    const tasks = await Task.find();
    res.status(200).json(tasks);
}))

// Start Task (Change Status to "in-progress")
router.put(
    "/start/:taskId", 
    authMiddleware, 
    asyncHandler(async (req: AuthRequest, res: Response) => {
        const { taskId } = req.params;

        if (!req.user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const task = await Task.findOne({ _id: taskId, assignedTo: req.user.id });

        if (!task) {
            res.status(404).json({ message: "Task not found or unauthorized" });
            return;
        }

        task.status = "progress";
        await task.save();

        res.status(200).json({ message: "Task marked as in-progress", task });
    })
);

// Complete Task (Change Status to "completed")
router.put(
    "/complete/:taskId", 
    authMiddleware, 
    asyncHandler(async (req: AuthRequest, res: Response) => {
        const { taskId } = req.params;

        if (!req.user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const task = await Task.findOne({ _id: taskId, assignedTo: req.user.id });

        if (!task) {
            res.status(404).json({ message: "Task not found or unauthorized" });
            return;
        }

        task.status = "completed";
        await task.save();

        res.status(200).json({ message: "Task marked as completed", task });
    })
);


router.get("/workers", authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const workers = await User.find({ role: "worker" }, "name _id");
      res.json(workers);
    } catch (error) {
      console.error("Error fetching workers:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

export default router;