import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Calendar, CheckSquare, Plus, ClipboardList, Activity, TrendingUp } from "lucide-react";
import CreateTask from "../components/CreateTask";

interface Task {
  _id: string;
  title: string;
  assignedTo: string | null; // Store worker's ID
  status: "pending" | "progress" | "completed";
  createdAt: string;
}

interface Worker {
  _id: string;
  name: string; // Updated to use the name
  email: string;
}

const AdminDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [workersCount, setWorkersCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("recent");
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [workerMap, setWorkerMap] = useState<{ [key: string]: string }>({}); // Map worker ID to name

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Fetch tasks
      const taskResponse = await fetch("http://localhost:3000/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Fetch workers (including name and email)
      const workerResponse = await fetch("http://localhost:3000/workers", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!taskResponse.ok || !workerResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const taskData = await taskResponse.json();
      const workerData = await workerResponse.json();

      // Create a worker map (ID → name)
      const workerMap = workerData.reduce((acc: { [key: string]: string }, worker: Worker) => {
        acc[worker._id] = worker.name; // Store worker name instead of email
        return acc;
      }, {});

      setTasks(taskData);
      setWorkers(workerData);
      setWorkersCount(workerData.length);
      setWorkerMap(workerMap);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const recentTasks = tasks.slice(0, 5);
  const pendingTasks = tasks.filter((task) => task.status === "pending");
  const completedTasks = tasks.filter((task) => task.status === "completed");

  const stats = [
    { 
      title: "Total Workers", 
      value: workersCount, 
      icon: <Users className="h-7 w-7" />, 
      gradient: "from-blue-500 to-blue-600", 
      key: "workers",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    { 
      title: "Pending Tasks", 
      value: pendingTasks.length, 
      icon: <Calendar className="h-7 w-7" />, 
      gradient: "from-amber-500 to-orange-500", 
      key: "pending",
      bgColor: "bg-amber-50",
      textColor: "text-amber-600"
    },
    { 
      title: "Completed Tasks", 
      value: completedTasks.length, 
      icon: <CheckSquare className="h-7 w-7" />, 
      gradient: "from-emerald-500 to-green-600", 
      key: "completed",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600"
    },
    { 
      title: "Recent Tasks", 
      value: recentTasks.length, 
      icon: <Activity className="h-7 w-7" />, 
      gradient: "from-purple-500 to-indigo-600", 
      key: "recent",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium';
      case 'progress':
        return 'bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium';
      default:
        return 'bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium';
    }
  };

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
              Admin Dashboard
            </h1>
            <p className="text-slate-600 mt-1">Manage your team and tasks efficiently</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCreateTask(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
          >
            <Plus className="h-5 w-5" />
            <span>Create New Task</span>
          </motion.button>
        </motion.div>

        {/* Loading and Error States */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="ml-4 text-slate-600 font-medium">Loading dashboard data...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-700 font-medium">Error: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className={`relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group ${
                    selectedCategory === stat.key ? "ring-2 ring-blue-400 ring-offset-2" : ""
                  }`}
                  onClick={() => setSelectedCategory(stat.key)}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className={`${stat.bgColor} p-3 rounded-xl`}>
                        <div className={stat.textColor}>{stat.icon}</div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
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
                  {selectedCategory === "workers"
                    ? "Team Members"
                    : selectedCategory === "pending"
                    ? "Pending Tasks"
                    : selectedCategory === "completed"
                    ? "Completed Tasks"
                    : selectedCategory === "recent"
                    ? "Recent Activity"
                    : "All Tasks"}
                </h2>
              </div>

              <div className="p-8">
                <div className="space-y-4">
                  {selectedCategory === "workers" ? (
                    workers.length > 0 ? (
                      workers.map((worker, index) => (
                        <motion.div 
                          key={worker._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="group p-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {worker.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <h5 className="font-bold text-slate-800 text-lg">{worker.name}</h5>
                              <p className="text-slate-600">{worker.email}</p>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <Users className="h-5 w-5 text-blue-500" />
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <Users className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 text-lg">No team members found</p>
                      </div>
                    )
                  ) : (
                    (() => {
                      let filteredTasks: Task[] = [];

                      if (selectedCategory === "pending") {
                        filteredTasks = pendingTasks;
                      } else if (selectedCategory === "completed") {
                        filteredTasks = completedTasks;
                      } else if (selectedCategory === "recent") {
                        filteredTasks = recentTasks;
                      } else {
                        filteredTasks = tasks;
                      }

                      return filteredTasks.length > 0 ? (
                        filteredTasks.map((task, index) => (
                          <motion.div 
                            key={task._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group p-6 bg-gradient-to-r from-slate-50 to-purple-50 rounded-xl border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all duration-200"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h3 className="font-bold text-slate-800 text-lg mb-2">{task.title}</h3>
                                <div className="flex items-center space-x-4">
                                  <p className="text-slate-600">
                                    <span className="font-medium">Assigned to:</span>{" "}
                                    <span className="font-semibold text-slate-800">
                                      {task.assignedTo ? workerMap[task.assignedTo] || "Unknown Worker" : "Unassigned"}
                                    </span>
                                  </p>
                                  <span className={getStatusBadge(task.status)}>
                                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                  </span>
                                </div>
                              </div>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <ClipboardList className="h-5 w-5 text-purple-500" />
                              </div>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <ClipboardList className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                          <p className="text-slate-500 text-lg">No tasks available</p>
                        </div>
                      );
                    })()
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}

        {showCreateTask && <CreateTask onClose={() => setShowCreateTask(false)} onTaskCreated={fetchData} />}
      </div>
    </div>
  );
};

export default AdminDashboard;
