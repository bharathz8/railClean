import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { CheckCircle, Clock, AlertCircle, Play } from "lucide-react";

interface Task {
  _id: string;
  title: string;
  junction: string;
  train: string;
  trainCoach: [string];
  status: "completed" | "in-progress" | "pending";
  time: string;
  assignedTo?: { name: string };
  label?: string;
  date?: string;
  notes?: string;
}

const WorkerDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<"all" | "active" | "completed">("all");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found. Redirecting to login...");
          return;
        }

        const response = await axios.get("http://localhost:3000/my-tasks", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (Array.isArray(response.data)) {
          setTasks(response.data);
        } else {
          console.error("Invalid data format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const updateTaskStatus = async (taskId: string, newStatus: "in-progress" | "completed") => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. Cannot update task.");
        return;
      }

      await axios.put(
        `http://localhost:3000/complete/${taskId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error(`Error updating task to ${newStatus}:`, error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading tasks...</p>;

  // **Filter tasks based on selected category**
  const filteredTasks = tasks.filter((task) => {
    if (selectedCategory === "completed") return task.status === "completed";
    if (selectedCategory === "active") return task.status !== "completed";
    return true;
  });

  return (
    <div className="space-y-6">
      <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-3xl font-bold text-gray-900">
        Worker Dashboard
      </motion.h1>

      {/* Task Summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className={`bg-white p-6 rounded-lg shadow-md cursor-pointer ${
            selectedCategory === "all" ? "border-2 border-blue-600" : ""
          }`}
          onClick={() => setSelectedCategory("all")}
        >
          <h2 className="text-xl font-semibold mb-2">Total Tasks</h2>
          <div className="text-3xl font-bold text-blue-600">{tasks.length}</div>
        </div>
        <div
          className={`bg-white p-6 rounded-lg shadow-md cursor-pointer ${
            selectedCategory === "active" ? "border-2 border-yellow-600" : ""
          }`}
          onClick={() => setSelectedCategory("active")}
        >
          <h2 className="text-xl font-semibold mb-2">Active Tasks</h2>
          <div className="text-3xl font-bold text-yellow-600">{tasks.filter((t) => t.status !== "completed").length}</div>
        </div>
        <div
          className={`bg-white p-6 rounded-lg shadow-md cursor-pointer ${
            selectedCategory === "completed" ? "border-2 border-green-600" : ""
          }`}
          onClick={() => setSelectedCategory("completed")}
        >
          <h2 className="text-xl font-semibold mb-2">Completed Tasks</h2>
          <div className="text-3xl font-bold text-green-600">{tasks.filter((t) => t.status === "completed").length}</div>
        </div>
      </motion.div>

      {/* Task List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            {selectedCategory === "completed" ? "Completed Tasks" : "Active Tasks"}
          </h2>

          {filteredTasks.length === 0 ? (
            <p className="text-gray-500">No tasks found.</p>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task, index) => (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(task.status)}
                    <div>
                      <h3 className="font-medium">{task.junction}</h3>
                      <p className="text-sm text-gray-600">title: {task.title || "N/A"}</p>
                      <p className="text-sm text-gray-600">Label: {task.label || "N/A"}</p>
                      <p className="text-sm text-gray-600">Train: {task.train || "N/A"}</p>
                      <p className="text-sm text-gray-600">Train Coach: {task.trainCoach || "N/A"}</p>
                      <p className="text-sm text-gray-600">Date & Time: {new Date(task.time).toLocaleString()}</p>
                      {task.notes && <p className="text-sm text-gray-500">Notes: {task.notes}</p>}
                    </div>
                  </div>

                  {task.status === "pending" && (
                    <button
                      onClick={() => updateTaskStatus(task._id, "in-progress")}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
                    >
                      <Play className="h-4 w-4 mr-2" /> Start Task
                    </button>
                  )}

                  {task.status === "in-progress" && (
                    <button
                      onClick={() => updateTaskStatus(task._id, "completed")}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      Mark as Completed
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default WorkerDashboard;
