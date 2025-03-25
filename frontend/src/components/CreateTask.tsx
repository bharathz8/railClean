import React, { useState, useEffect } from "react";

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
    label: "garbage",
    assignedTo: "",
    time: "",
    notes: "",
    status: "pending", 
  });

  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingWorkers, setFetchingWorkers] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

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
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
        const token = localStorage.getItem("token"); // Get token from localStorage
        if (!token) {
            throw new Error("No authentication token found. Please log in.");
        }

        const formattedTaskData = {
            ...taskData,
            time: new Date(taskData.time).toISOString(),
        };

        console.log("Sending Task Data:", formattedTaskData);

        const response = await fetch("http://localhost:3000/create-task", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Send token in headers
            },
            body: JSON.stringify(formattedTaskData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Task creation failed");
        }

        onTaskCreated();
        onClose();
    } catch (error: any) {
        console.error("Error:", error);
        setErrorMessage(`Failed to create task: ${error.message}`);
    } finally {
        setLoading(false);
    }
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Create Task</h2>
        
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="title"
            placeholder="Title"
            className="w-full border p-2"
            onChange={handleChange}
            required
          />

            <input
            type="text"
            name="junction"
            placeholder="junction"
            className="w-full border p-2"
            onChange={handleChange}
            required
          />

          <select name="label" className="w-full border p-2" onChange={handleChange}>
            <option value="garbage">Garbage</option>
            <option value="infestation">Infestation</option>
            <option value="restroom">Restroom</option>
          </select>

          {fetchingWorkers ? (
            <p className="text-gray-500">Loading workers...</p>
          ) : (
            <select
              name="assignedTo"
              className="w-full border p-2"
              onChange={handleChange}
              required
            >
              <option value="">Select a Worker</option>
              {workers.map((worker) => (
                <option key={worker._id} value={worker._id}>
                  {worker.name}
                </option>
              ))}
            </select>
          )}

          <input
            type="datetime-local"
            name="time"
            className="w-full border p-2"
            onChange={handleChange}
            required
          />

          <textarea
            name="notes"
            placeholder="Notes"
            className="w-full border p-2"
            onChange={handleChange}
          ></textarea>

          <button
            type="submit"
            className={`w-full text-white px-4 py-2 rounded-lg ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </form>

        <button onClick={onClose} className="mt-3 text-gray-600 hover:text-gray-800">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CreateTask;
