import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Calendar, CheckSquare, Plus, ClipboardList } from "lucide-react";
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
    { title: "Total Workers", value: workersCount, icon: <Users className="h-6 w-6" />, color: "bg-blue-500", key: "workers" },
    { title: "Pending Tasks", value: pendingTasks.length, icon: <Calendar className="h-6 w-6" />, color: "bg-yellow-500", key: "pending" },
    { title: "Completed Tasks", value: completedTasks.length, icon: <CheckSquare className="h-6 w-6" />, color: "bg-purple-500", key: "completed" },
    { title: "Recent Tasks", value: recentTasks.length, icon: <ClipboardList className="h-6 w-6" />, color: "bg-orange-500", key: "recent" },
  ];

  return (
    <div className="space-y-6">
      <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-3xl font-bold text-gray-900">
        Admin Dashboard
      </motion.h1>

      {loading && <p className="text-center text-gray-600">Loading data...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      <button
        onClick={() => setShowCreateTask(true)}
        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition"
      >
        <Plus className="h-5 w-5" />
        <span>Create Task</span>
      </button>

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition ${
                selectedCategory === stat.key ? "ring-2 ring-blue-400" : ""
              }`}
              onClick={() => setSelectedCategory(stat.key)}
            >
              <div className="flex items-center space-x-4">
                <div className={`${stat.color} p-3 rounded-full text-white`}>{stat.icon}</div>
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-xl font-semibold mb-4">
          {selectedCategory === "workers"
            ? "All Workers"
            : selectedCategory === "pending"
            ? "Pending Tasks"
            : selectedCategory === "completed"
            ? "Completed Tasks"
            : selectedCategory === "recent"
            ? "Recent Tasks"
            : "All Tasks"}
        </h2>

        <div className="space-y-4">
          {selectedCategory === "workers" ? (
            workers.length > 0 ? (
              workers.map((worker) => (
                <div key={worker._id} className="p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-bold">{worker.name}</h5>
                  <p className="text-gray-600">{worker.email}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No workers found</p>
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
                filteredTasks.map((task) => (
                  <div key={task._id} className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-sm text-gray-600">
                      Assigned to:{" "}
                      <span className="font-semibold">
                        {task.assignedTo ? workerMap[task.assignedTo] || "Unknown Worker" : "Unassigned"}
                      </span>
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No tasks available</p>
              );
            })()
          )}
        </div>
      </motion.div>

      {showCreateTask && <CreateTask onClose={() => setShowCreateTask(false)} onTaskCreated={fetchData} />}
    </div>
  );
};

export default AdminDashboard;
