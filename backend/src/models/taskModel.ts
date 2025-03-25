import mongoose, { Document, Schema } from "mongoose";

interface ITask extends Document {
    title: string,
    junction: string,
    label: "garbage" | "infestation" | "restroom",
    assignedTo: mongoose.Types.ObjectId,
    time: Date,
    notes: string,
    status: "pending" | "progress" | "completed"        
}

const taskSchema = new Schema<ITask>({
    title: {type: String, required: true},
    junction: {type: String, required: true},
    label: {type: String, enum: ["garbage", "infestation", "restroom"], required:true},
    time: {type: Date, required: true},
    assignedTo: {type: Schema.Types.ObjectId, ref: "Worker", required: true},
    notes: {type: String},
    status: {type: String, enum: ["pending", "progress", "completed"], default: "progress", required: true}
})

export default mongoose.model<ITask>("Task", taskSchema);