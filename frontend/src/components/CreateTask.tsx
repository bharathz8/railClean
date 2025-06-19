import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Clock,
  MapPin,
  Train,
  Users,
  Tag,
  FileText,
  Calendar,
  Loader2,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  Plus,
} from "lucide-react";

interface Worker {
  _id: string;
  name: string;
}

interface CreateTaskProps {
  onClose: () => void;
  onTaskCreated: () => void;
}

const CreateTask: React.FC<CreateTaskProps> = ({ onClose, onTaskCreated }) => {
  const [taskData, setTaskData] = useState({
    title: "",
    Junction: "",
    train: "",
    trainCoach: [""],
    label: "",
    assignedTo: "",
    time: "",
    notes: "",
    status: "pending",
  });

  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingWorkers, setFetchingWorkers] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    assignment: false,
    schedule: false,
  });

  const coachOptions = [
    { type: "1st AC", coaches: ["A"] },
    { type: "2nd AC", coaches: ["B1", "B2", "B3"] },
    { type: "3rd AC", coaches: ["C1", "C2", "C3", "C4", "C5", "C6"] },
    {
      type: "Sleeper",
      coaches: Array.from({ length: 20 }, (_, i) => `S${i + 1}`),
    },
    { type: "General", coaches: ["General"] },
  ];

  const junctionOptions = [
    {
      value: "Ballari junction railway station",
      label: "Ballari Junction",
      icon: "🚉",
    },
    {
      value: "Bengaluru city railway station",
      label: "Bengaluru City",
      icon: "🏙️",
    },
    {
      value: "Kalaburgi junction railway station",
      label: "Kalaburgi Junction",
      icon: "🚉",
    },
    {
      value: "Mangalore junction railway station",
      label: "Mangalore Junction",
      icon: "🌊",
    },
    {
      value: "Mysore junction railway station",
      label: "Mysore Junction",
      icon: "🏛️",
    },
  ];

  const trainOptions = [
    { value: "Amravathi express", label: "Amravathi Express", icon: "🚄" },
    {
      value: "Bangalore sangli rani chennamma express",
      label: "Bangalore Sangli Rani Chennamma Express",
      icon: "🚄",
    },
    { value: "Basava express", label: "Basava Express", icon: "🚄" },
    {
      value: "Thiruvananthapuram rajdhani express",
      label: "Thiruvananthapuram Rajdhani Express",
      icon: "🚄",
    },
    { value: "Mysore express", label: "Mysore Express", icon: "🚄" },
  ];

  const categoryOptions = [
    { value: "garbage", label: "Garbage", icon: "🗑️" },
    { value: "infestation", label: "Pest Control", icon: "🐛" },
    { value: "restroom", label: "Restroom", icon: "🚿" },
  ];

  // Fetch workers from backend
  useEffect(() => {
    const fetchWorkers = async () => {
      setFetchingWorkers(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/workers", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401 || response.status === 403) {
          setErrorMessage("You are not authorized to view this data.");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch workers");
        }

        const data = await response.json();
        setWorkers(data);
      } catch (error) {
        console.error("Error fetching workers:", error);
        setErrorMessage("Failed to fetch workers. Please try again.");
      } finally {
        setFetchingWorkers(false);
      }
    };

    fetchWorkers();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const validateForm = () => {
    if (!taskData.title.trim()) {
      setErrorMessage("Task title is required");
      return false;
    }
    if (!taskData.Junction) {
      setErrorMessage("Junction selection is required");
      return false;
    }
    if (!taskData.train) {
      setErrorMessage("Train selection is required");
      return false;
    }
    if (!taskData.trainCoach[0]) {
      setErrorMessage("Coach selection is required");
      return false;
    }
    if (!taskData.label) {
      setErrorMessage("Task category is required");
      return false;
    }
    if (!taskData.assignedTo) {
      setErrorMessage("Worker assignment is required");
      return false;
    }
    if (!taskData.time) {
      setErrorMessage("Schedule time is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const formattedTaskData = {
        ...taskData,
        time: new Date(taskData.time).toISOString(),
      };

      const response = await fetch("http://localhost:3000/create-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedTaskData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Task creation failed");
      }

      setSuccessMessage("Task created successfully!");

      setTimeout(() => {
        onTaskCreated();
        onClose();
      }, 1000);
    } catch (error: any) {
      console.error("Error:", error);
      setErrorMessage(`Failed to create task: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const SectionHeader = ({
    title,
    icon,
    isExpanded,
    onClick,
    isComplete,
  }: {
    title: string;
    icon: React.ReactNode;
    isExpanded: boolean;
    onClick: () => void;
    isComplete: boolean;
  }) => (
    <motion.div
      onClick={onClick}
      className={`flex items-center justify-between p-3 cursor-pointer rounded-lg border-2 transition-all ${
        isExpanded
          ? "border-blue-500 bg-blue-50"
          : isComplete
          ? "border-green-500 bg-green-50"
          : "border-gray-200 bg-gray-50 hover:border-gray-300"
      }`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-center space-x-2">
        {icon}
        <span className="font-medium text-gray-800">{title}</span>
        {isComplete && <CheckCircle className="w-4 h-4 text-green-500" />}
      </div>
      <motion.div
        animate={{ rotate: isExpanded ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </motion.div>
    </motion.div>
  );

  const isBasicComplete = taskData.title && taskData.Junction && taskData.train;
  const isAssignmentComplete =
    taskData.trainCoach[0] && taskData.label && taskData.assignedTo;
  const isScheduleComplete = taskData.time;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Compact Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Create Task</h2>
              <p className="text-blue-100 text-sm">Railway maintenance task</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 p-1.5 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Messages */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-sm"
                >
                  <AlertCircle className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                  <p className="text-red-700">{errorMessage}</p>
                </motion.div>
              )}

              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center text-sm"
                >
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <p className="text-green-700">{successMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              {/* Basic Information Section */}
              <div>
                <SectionHeader
                  title="Basic Information"
                  icon={<FileText className="w-4 h-4 text-blue-500" />}
                  isExpanded={expandedSections.basic}
                  onClick={() => toggleSection("basic")}
                  isComplete={isBasicComplete}
                />

                <AnimatePresence>
                  {expandedSections.basic && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 space-y-3 overflow-hidden"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Task Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          placeholder="Enter task title"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          value={taskData.title}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Junction
                          </label>
                          <select
                            name="Junction"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            value={taskData.Junction}
                            onChange={handleChange}
                          >
                            <option value="">Select</option>
                            {junctionOptions.map((junction) => (
                              <option
                                key={junction.value}
                                value={junction.value}
                              >
                                {junction.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Train
                          </label>
                          <select
                            name="train"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            value={taskData.train}
                            onChange={handleChange}
                          >
                            <option value="">Select</option>
                            {trainOptions.map((train) => (
                              <option key={train.value} value={train.value}>
                                {train.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Assignment Section */}
              <div>
                <SectionHeader
                  title="Assignment Details"
                  icon={<Users className="w-4 h-4 text-purple-500" />}
                  isExpanded={expandedSections.assignment}
                  onClick={() => toggleSection("assignment")}
                  isComplete={isAssignmentComplete}
                />

                <AnimatePresence>
                  {expandedSections.assignment && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 space-y-3 overflow-hidden"
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Coach
                          </label>
                          <select
                            name="trainCoach"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            value={taskData.trainCoach[0]}
                            onChange={(e) =>
                              setTaskData({
                                ...taskData,
                                trainCoach: [e.target.value],
                              })
                            }
                          >
                            <option value="">Select</option>
                            {coachOptions.map((group) => (
                              <optgroup key={group.type} label={group.type}>
                                {group.coaches.map((coach) => (
                                  <option key={coach} value={coach}>
                                    {coach}
                                  </option>
                                ))}
                              </optgroup>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                          </label>
                          <select
                            name="label"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            value={taskData.label}
                            onChange={handleChange}
                          >
                            <option value="">Select</option>
                            {categoryOptions.map((category) => (
                              <option
                                key={category.value}
                                value={category.value}
                              >
                                {category.icon} {category.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Assign Worker
                        </label>
                        {fetchingWorkers ? (
                          <div className="flex items-center justify-center p-3 bg-blue-50 rounded-lg border">
                            <Loader2 className="animate-spin h-4 w-4 text-blue-600 mr-2" />
                            <span className="text-blue-600 text-sm">
                              Loading workers...
                            </span>
                          </div>
                        ) : (
                          <select
                            name="assignedTo"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            value={taskData.assignedTo}
                            onChange={handleChange}
                          >
                            <option value="">Select worker</option>
                            {workers.map((worker) => (
                              <option key={worker._id} value={worker._id}>
                                {worker.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Schedule Section */}
              <div>
                <SectionHeader
                  title="Schedule & Notes"
                  icon={<Calendar className="w-4 h-4 text-green-500" />}
                  isExpanded={expandedSections.schedule}
                  onClick={() => toggleSection("schedule")}
                  isComplete={isScheduleComplete}
                />

                <AnimatePresence>
                  {expandedSections.schedule && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 space-y-3 overflow-hidden"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Schedule Date & Time
                        </label>
                        <input
                          type="datetime-local"
                          name="time"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          value={taskData.time}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Notes (Optional)
                        </label>
                        <textarea
                          name="notes"
                          placeholder="Additional instructions..."
                          rows={3}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                          value={taskData.notes}
                          onChange={handleChange}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Footer with Actions */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm font-medium"
              >
                Cancel
              </button>

              <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                  loading
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                }`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Creating...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Task
                  </div>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateTask;
