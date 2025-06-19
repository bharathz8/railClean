import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Play,
  User,
  Calendar,
  ClipboardList,
  TrendingUp,
  Train,
  MapPin,
  Tag,
  FileText,
} from "lucide-react";

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
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "active" | "completed"
  >("all");

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

  const updateTaskStatus = async (
    taskId: string,
    newStatus: "in-progress" | "completed"
  ) => {
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
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-amber-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium";
      case "in-progress":
        return "bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium";
      case "completed":
        return "bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium";
      default:
        return "bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium";
    }
  };

  // Filter tasks based on selected category
  const filteredTasks = tasks.filter((task) => {
    if (selectedCategory === "completed") return task.status === "completed";
    if (selectedCategory === "active") return task.status !== "completed";
    return true;
  });

  const stats = [
    {
      title: "Total Tasks",
      value: tasks.length,
      icon: <ClipboardList className="h-7 w-7" />,
      gradient: "from-blue-500 to-blue-600",
      key: "all",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Active Tasks",
      value: tasks.filter((t) => t.status !== "completed").length,
      icon: <Clock className="h-7 w-7" />,
      gradient: "from-amber-500 to-orange-500",
      key: "active",
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
    },
    {
      title: "Completed Tasks",
      value: tasks.filter((t) => t.status === "completed").length,
      icon: <CheckCircle className="h-7 w-7" />,
      gradient: "from-emerald-500 to-green-600",
      key: "completed",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Worker Dashboard
            </h1>
            <p className="text-slate-600 mt-1">
              Track and manage your assigned tasks
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-xl shadow-lg">
            <User className="h-5 w-5 text-blue-600" />
            <span className="text-slate-700 font-medium">Welcome back!</span>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="ml-4 text-slate-600 font-medium">
              Loading your tasks...
            </p>
          </div>
        )}

        {!loading && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className={`relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group ${
                    selectedCategory === stat.key
                      ? "ring-2 ring-blue-400 ring-offset-2"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedCategory(
                      stat.key as "all" | "active" | "completed"
                    )
                  }
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className={`${stat.bgColor} p-3 rounded-xl`}>
                        <div className={stat.textColor}>{stat.icon}</div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-600 mb-1">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-bold text-slate-800">
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}
                  ></div>
                </motion.div>
              ))}
            </div>

            {/* Main Content Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-blue-300" />
                  {selectedCategory === "completed"
                    ? "Completed Tasks"
                    : selectedCategory === "active"
                    ? "Active Tasks"
                    : "All Tasks"}
                </h2>
              </div>

              <div className="p-8">
                <div className="space-y-4">
                  {filteredTasks.length === 0 ? (
                    <div className="text-center py-12">
                      <ClipboardList className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 text-lg">No tasks found</p>
                    </div>
                  ) : (
                    filteredTasks.map((task, index) => (
                      <motion.div
                        key={task._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group p-6 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              {getStatusIcon(task.status)}
                              <h3 className="font-bold text-slate-800 text-lg">
                                {task.junction}
                              </h3>
                              <span className={getStatusBadge(task.status)}>
                                {task.status === "in-progress"
                                  ? "In Progress"
                                  : task.status.charAt(0).toUpperCase() +
                                    task.status.slice(1)}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-slate-500" />
                                  <span className="text-slate-600">Title:</span>
                                  <span className="font-medium text-slate-800">
                                    {task.title || "N/A"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Tag className="h-4 w-4 text-slate-500" />
                                  <span className="text-slate-600">Label:</span>
                                  <span className="font-medium text-slate-800">
                                    {task.label || "N/A"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Train className="h-4 w-4 text-slate-500" />
                                  <span className="text-slate-600">Train:</span>
                                  <span className="font-medium text-slate-800">
                                    {task.train || "N/A"}
                                  </span>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-slate-500" />
                                  <span className="text-slate-600">Coach:</span>
                                  <span className="font-medium text-slate-800">
                                    {task.trainCoach || "N/A"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-slate-500" />
                                  <span className="text-slate-600">
                                    Date & Time:
                                  </span>
                                  <span className="font-medium text-slate-800">
                                    {new Date(task.time).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {task.notes && (
                              <div className="mt-3 p-3 bg-slate-100 rounded-lg">
                                <p className="text-sm text-slate-600">
                                  <span className="font-medium">Notes:</span>{" "}
                                  {task.notes}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-2 lg:ml-4">
                            {task.status === "pending" && (
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() =>
                                  updateTaskStatus(task._id, "in-progress")
                                }
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
                              >
                                <Play className="h-4 w-4" />
                                Start Task
                              </motion.button>
                            )}

                            {task.status === "in-progress" && (
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() =>
                                  updateTaskStatus(task._id, "completed")
                                }
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
                              >
                                <CheckCircle className="h-4 w-4" />
                                Mark Complete
                              </motion.button>
                            )}

                            {task.status === "completed" && (
                              <div className="flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
                                <CheckCircle className="h-4 w-4" />
                                <span className="font-medium">Completed</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default WorkerDashboard;
