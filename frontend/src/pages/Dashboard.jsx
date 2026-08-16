import { useEffect, useState } from "react";
import "../styles/dashboard.css";
import api from "../services/api";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import SearchFilter from "../components/dashboard/SearchFilter";
import CreateTaskForm from "../components/dashboard/CreateTaskForm";
import TaskCard from "../components/dashboard/TaskCard";
import EditTaskForm from "../components/dashboard/EditTaskForm";
import TaskStats from "../components/dashboard/TaskStats";
import ReminderSettings from "../components/dashboard/ReminderSettings";
import AISummary from "../components/dashboard/AISummary";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  // =========================
  // TASK STATE
  // =========================

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // SEARCH & FILTER
  // =========================

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // =========================
  // MESSAGES
  // =========================

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================
  // CREATE TASK STATE
  // =========================

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    category: "Work",
    dueDate: "",
    dueTime: ""
  });

  // =========================
  // EDIT TASK STATE
  // =========================

  const [editingTaskId, setEditingTaskId] = useState(null);

  const [editTask, setEditTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    category: "Work",
    dueDate: "",
    dueTime: ""
  });

  // =========================
  // GET TASKS
  // =========================

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/tasks");
const data = response.data;

      setTasks(
        Array.isArray(data)
          ? data
          : Array.isArray(data.tasks)
            ? data.tasks
            : [],
      );
    } catch (error) {
      console.error("Fetch tasks error:", error);
      setError(
            error.response?.data?.message ||
            error.message ||
            "Failed to load tasks"
          );
      } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // =========================
  // HANDLE CREATE FORM INPUT
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewTask((previousTask) => ({
      ...previousTask,
      [name]: value,
    }));
  };

  // =========================
  // CREATE TASK
  // =========================

  const handleCreateTask = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!newTask.title.trim()) {
      setError("Please enter a task title.");
      return;
    }

    try {
      const response = await api.post("/tasks", {
  title: newTask.title,
  description: newTask.description,
  priority: newTask.priority,
  category: newTask.category,
  dueDate: newTask.dueDate || null,
  dueTime: newTask.dueTime || null,
});

const data = response.data;

      const createdTask = data.task || data;

      setTasks((previousTasks) => {
        const currentTasks = Array.isArray(previousTasks) ? previousTasks : [];

        return [createdTask, ...currentTasks];
      });

      // Clear form
      setNewTask({
        title: "",
        description: "",
        priority: "Medium",
        category: "Work",
        dueDate: "",
  dueTime: ""
      });

      // Close form
      setShowCreateForm(false);

      // Success message
      setSuccess("Task created successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("Create task error:", error);
      setError(error.message || "Failed to create task");
    }
  };

  // =========================
  // TOGGLE TASK STATUS
  // =========================

  const handleToggleTask = async (taskId) => {
    setError("");
    setSuccess("");

    try {
      const response = await api.patch(`/tasks/${taskId}/status`);
const data = response.data;

const updatedTask = data.task || data;

      setTasks((previousTasks) => {
        const currentTasks = Array.isArray(previousTasks) ? previousTasks : [];

        return currentTasks.map((task) =>
          task._id === taskId ? updatedTask : task,
        );
      });

      setSuccess("Task status updated.");

      setTimeout(() => {
        setSuccess("");
      }, 2000);
    } catch (error) {
      console.error("Toggle task error:", error);

      setError(error.message || "Failed to update task status");
    }
  };

  // =========================
  // DELETE TASK
  // =========================

  const handleDeleteTask = async (taskId) => {
    setError("");
    setSuccess("");

    try {
      const response = await api.delete(`/tasks/${taskId}`);
const data = response.data;

      setTasks((previousTasks) => {
        const currentTasks = Array.isArray(previousTasks) ? previousTasks : [];

        return currentTasks.filter((task) => task._id !== taskId);
      });

      setSuccess("Task deleted successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 2000);
    } catch (error) {
      console.error("Delete task error:", error);

      setError(error.message || "Failed to delete task");
    }
  };

  // =========================
  // START EDITING TASK
  // =========================

  const startEditingTask = (task) => {
    setEditingTaskId(task._id);

    setEditTask({
      title: task.title || "",
      description: task.description || "",
      priority: task.priority || "Medium",
      category: task.category || "Work",
      dueDate: task.dueDate
        ? new Date(task.dueDate).toISOString().split("T")[0]
        : "",
        dueTime: task.dueTime || ""
    });

    setError("");
    setSuccess("");
  };

  // =========================
  // HANDLE EDIT INPUT
  // =========================

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditTask((previousTask) => ({
      ...previousTask,
      [name]: value,
    }));
  };

  // =========================
  // UPDATE TASK
  // =========================

  const handleUpdateTask = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!editTask.title.trim()) {
      setError("Please enter a task title.");
      return;
    }

    try {
      const response = await api.put(
  `/tasks/${editingTaskId}`,
  {
    title: editTask.title,
    description: editTask.description,
    priority: editTask.priority,
    category: editTask.category,
    dueDate: editTask.dueDate || null,
    dueTime: editTask.dueTime || null,
  }
);

const data = response.data;
      const updatedTask = data.task || data;

      setTasks((previousTasks) => {
        const currentTasks = Array.isArray(previousTasks) ? previousTasks : [];

        return currentTasks.map((task) =>
          task._id === editingTaskId ? updatedTask : task,
        );
      });

      setEditingTaskId(null);

      setEditTask({
        title: "",
        description: "",
        priority: "Medium",
        category: "Work",
        dueDate: "",
      });

      setSuccess("Task updated successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 2000);
    } catch (error) {
      console.error("Update task error:", error);

      setError(error.message || "Failed to update task");
    }
  };

  // =========================
  // FILTER TASKS
  // =========================

  const filteredTasks = tasks.filter((task) => {
    const search = searchText.toLowerCase().trim();

    const matchesSearch =
      task.title?.toLowerCase().includes(search) ||
      task.description?.toLowerCase().includes(search) ||
      task.category?.toLowerCase().includes(search);

    const matchesStatus =
  statusFilter === "all" ||
  (statusFilter === "completed" && task.status === "Completed") ||
  (statusFilter === "pending" && task.status === "Pending");
  
    return matchesSearch && matchesStatus;
  });

  // =========================
  // UI
  // =========================

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* HEADER */}

        <DashboardHeader
          user={user}
          showCreateForm={showCreateForm}
          onCreateClick={() => {
            setShowCreateForm(!showCreateForm);
            setError("");
            setSuccess("");
          }}
        />

        <TaskStats tasks={tasks} />

        <AISummary />

        <ReminderSettings />

        {/* SEARCH & FILTER */}

        <SearchFilter
          searchText={searchText}
          setSearchText={setSearchText}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {/* SUCCESS MESSAGE */}

        {success && <div className="success-message">{success}</div>}

        {/* ERROR MESSAGE */}

        {error && <div className="error-message">{error}</div>}

        {/* CREATE TASK FORM */}

        {showCreateForm && (
          <CreateTaskForm
            newTask={newTask}
            handleChange={handleChange}
            handleCreateTask={handleCreateTask}
            onCancel={() => {
              setShowCreateForm(false);
              setError("");
            }}
          />
        )}

        {/* LOADING */}

        {loading && <div className="message-card">Loading tasks...</div>}

        {/* NO TASKS */}

        {!loading && tasks.length === 0 && !error && (
          <div className="message-card empty-state">
            <h3>No tasks yet</h3>

            <p>Create your first task to get started.</p>
          </div>
        )}

        {/* NO MATCHING TASKS */}

        {!loading && tasks.length > 0 && filteredTasks.length === 0 && (
          <div className="message-card empty-state">
            <h3>No matching tasks</h3>

            <p>Try a different search or filter.</p>
          </div>
        )}

        {/* TASK LIST */}

        {!loading &&
          filteredTasks.length > 0 &&
          filteredTasks.map((task) => (
            <div key={task._id} className="task-wrapper">
              {editingTaskId === task._id ? (
                /* =========================
                   EDIT FORM
                ========================= */

                <EditTaskForm
                  editTask={editTask}
                  handleEditChange={handleEditChange}
                  handleUpdateTask={handleUpdateTask}
                  onCancel={() => {
                    setEditingTaskId(null);
                    setError("");
                  }}
                />
              ) : (
                /* =========================
                   NORMAL TASK CARD
                ========================= */

                <TaskCard
                  task={task}
                  onToggle={handleToggleTask}
                  onEdit={startEditingTask}
                  onDelete={handleDeleteTask}
                  onTaskUpdated={(updatedTask) => {
    setTasks((currentTasks) =>
      currentTasks.map((currentTask) =>
        currentTask._id === updatedTask._id
          ? updatedTask
          : currentTask
      )
    );
  }}
                />
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default Dashboard;