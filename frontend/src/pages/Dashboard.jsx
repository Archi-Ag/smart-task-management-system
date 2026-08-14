import { useEffect, useState } from "react";

const API_URL =
  "https://reimagined-sniffle-x5w4v6xxppgj36wqx-5000.app.github.dev";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // SEARCH & FILTER
  // =========================

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [editingTaskId, setEditingTaskId] = useState(null);

  const [editTask, setEditTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    category: "Work",
    dueDate: "",
  });

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    category: "Work",
    dueDate: "",
  });

  // =========================
  // GET TASKS
  // =========================

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/tasks`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load tasks");
      }

      setTasks(Array.isArray(data) ? data : data.tasks || []);
    } catch (error) {
      console.error("Fetch tasks error:", error);
      setError(error.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // =========================
  // HANDLE FORM INPUT
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
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description,
          priority: newTask.priority,
          category: newTask.category,
          dueDate: newTask.dueDate || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create task");
      }

      // Add newly created task to the screen
      setTasks((previousTasks) => {
        const currentTasks = Array.isArray(previousTasks) ? previousTasks : [];

        const createdTask = data.task || data;

        return [createdTask, ...currentTasks];
      });

      // Clear form
      setNewTask({
        title: "",
        description: "",
        priority: "Medium",
        category: "Work",
        dueDate: "",
      });

      // Close form
      setShowCreateForm(false);

      // Show success message
      setSuccess("Task created successfully.");

      // Remove success message after a few seconds
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

    console.log("in handleToggleTask");

    try {
      const response = await fetch(`${API_URL}/api/tasks/${taskId}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("in handleToggleTask response : ", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to update task status");
      }

      const updatedTask = data.task || data;

      setTasks((previousTasks) =>
        previousTasks.map((task) => (task._id === taskId ? updatedTask : task)),
      );

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
      const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete task");
      }

      setTasks((previousTasks) =>
        previousTasks.filter((task) => task._id !== taskId),
      );

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
      const response = await fetch(`${API_URL}/api/tasks/${editingTaskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editTask.title,
          description: editTask.description,
          priority: editTask.priority,
          category: editTask.category,
          dueDate: editTask.dueDate || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update task");
      }

      const updatedTask = data.task || data;

      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task._id === editingTaskId ? updatedTask : task,
        ),
      );

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
      (statusFilter === "completed" && task.status) ||
      (statusFilter === "pending" && !task.status);

    return matchesSearch && matchesStatus;
  });

  // =========================
  // UI
  // =========================

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f7fb",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "12px",
            marginBottom: "25px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <h1 style={{ marginTop: 0 }}>Smart Task Manager</h1>

          <p style={{ marginBottom: 0 }}>Welcome, {user?.name || "User"}!</p>
        </div>

        {/* TASK HEADER */}

        <div
          style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "12px",
            marginBottom: "25px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <h2 style={{ margin: 0 }}>My Tasks</h2>

            <button
              type="button"
              onClick={() => {
                setShowCreateForm(!showCreateForm);
                setError("");
                setSuccess("");
              }}
              style={{
                padding: "10px 18px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                backgroundColor: "#2563eb",
                color: "white",
                fontSize: "14px",
              }}
            >
              {showCreateForm ? "Cancel" : "+ Create Task"}
            </button>
          </div>
        </div>

        {/* =========================
    SEARCH & FILTER
========================= */}

<div
  style={{
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  }}
>
  <div
    style={{
      display: "flex",
      gap: "12px",
      alignItems: "center",
      flexWrap: "wrap",
    }}
  >
    {/* SEARCH */}

    <input
      type="text"
      placeholder="Search tasks..."
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      style={{
        flex: "1",
        minWidth: "250px",
        padding: "11px 14px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        fontSize: "14px",
      }}
    />

    {/* ALL */}

    <button
      type="button"
      onClick={() => setStatusFilter("all")}
      style={{
        padding: "10px 16px",
        border: "none",
        borderRadius: "8px",
        backgroundColor:
          statusFilter === "all"
            ? "#2563eb"
            : "#e5e7eb",
        color:
          statusFilter === "all"
            ? "white"
            : "#111827",
        cursor: "pointer",
      }}
    >
      All
    </button>

    {/* PENDING */}

    <button
      type="button"
      onClick={() =>
        setStatusFilter("pending")
      }
      style={{
        padding: "10px 16px",
        border: "none",
        borderRadius: "8px",
        backgroundColor:
          statusFilter === "pending"
            ? "#f59e0b"
            : "#e5e7eb",
        color:
          statusFilter === "pending"
            ? "white"
            : "#111827",
        cursor: "pointer",
      }}
    >
      Pending
    </button>

    {/* COMPLETED */}

    <button
      type="button"
      onClick={() =>
        setStatusFilter("completed")
      }
      style={{
        padding: "10px 16px",
        border: "none",
        borderRadius: "8px",
        backgroundColor:
          statusFilter === "completed"
            ? "#16a34a"
            : "#e5e7eb",
        color:
          statusFilter === "completed"
            ? "white"
            : "#111827",
        cursor: "pointer",
      }}
    >
      Completed
    </button>
  </div>
</div>

        {/* SUCCESS MESSAGE */}

        {success && (
          <div
            style={{
              backgroundColor: "#dcfce7",
              color: "#166534",
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            {success}
          </div>
        )}

        {/* ERROR MESSAGE */}

        {error && (
          <div
            style={{
              backgroundColor: "#fee2e2",
              color: "#991b1b",
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {/* CREATE TASK FORM */}

        {showCreateForm && (
          <div
            style={{
              backgroundColor: "white",
              padding: "25px",
              borderRadius: "12px",
              marginBottom: "25px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Create New Task</h3>

            <form onSubmit={handleCreateTask}>
              {/* TITLE */}

              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "bold",
                  }}
                >
                  Task Title
                </label>

                <input
                  type="text"
                  name="title"
                  placeholder="Enter task title"
                  value={newTask.title}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "11px",
                    border: "1px solid #ccc",
                    borderRadius: "7px",
                  }}
                />
              </div>

              {/* DESCRIPTION */}

              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "bold",
                  }}
                >
                  Description
                </label>

                <textarea
                  name="description"
                  placeholder="Describe the task"
                  value={newTask.description}
                  onChange={handleChange}
                  rows="4"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "11px",
                    border: "1px solid #ccc",
                    borderRadius: "7px",
                    resize: "vertical",
                  }}
                />
              </div>

              {/* PRIORITY */}

              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "bold",
                  }}
                >
                  Priority
                </label>

                <select
                  name="priority"
                  value={newTask.priority}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "11px",
                    border: "1px solid #ccc",
                    borderRadius: "7px",
                  }}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              {/* CATEGORY */}

              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "bold",
                  }}
                >
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  placeholder="e.g. Work, Personal, Study"
                  value={newTask.category}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "11px",
                    border: "1px solid #ccc",
                    borderRadius: "7px",
                  }}
                />
              </div>

              {/* DUE DATE */}

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "bold",
                  }}
                >
                  Due Date
                </label>

                <input
                  type="date"
                  name="dueDate"
                  value={newTask.dueDate}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "11px",
                    border: "1px solid #ccc",
                    borderRadius: "7px",
                  }}
                />
              </div>

              {/* FORM BUTTONS */}

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <button
                  type="submit"
                  style={{
                    padding: "11px 20px",
                    border: "none",
                    borderRadius: "7px",
                    backgroundColor: "#16a34a",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Save Task
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setError("");
                  }}
                  style={{
                    padding: "11px 20px",
                    border: "1px solid #ccc",
                    borderRadius: "7px",
                    backgroundColor: "white",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TASK LIST */}

        {loading && (
          <div
            style={{
              backgroundColor: "white",
              padding: "25px",
              borderRadius: "12px",
            }}
          >
            Loading tasks...
          </div>
        )}

        {!loading && tasks.length === 0 && !error && (
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <h3>No tasks yet</h3>

            {!loading && tasks.length > 0 && filteredTasks.length === 0 && (
              <div
                style={{
                  backgroundColor: "white",
                  padding: "30px",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <h3>No matching tasks</h3>

                <p>Try a different search or filter.</p>
              </div>
            )}

            <p>Create your first task to get started.</p>
          </div>
        )}

        {!loading &&
          filteredTasks.length > 0 &&
          filteredTasks.map((task) => (
            <div
              key={task._id}
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "12px",
                marginBottom: "15px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "20px",
                }}
              >
                <div>
                  {editingTaskId === task._id ? (
                    /* =========================
       EDIT FORM
       ========================= */
                    <form onSubmit={handleUpdateTask}>
                      <h3 style={{ marginTop: 0 }}>Edit Task</h3>

                      {/* TITLE */}

                      <div style={{ marginBottom: "15px" }}>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "6px",
                            fontWeight: "bold",
                          }}
                        >
                          Task Title
                        </label>

                        <input
                          type="text"
                          name="title"
                          value={editTask.title}
                          onChange={handleEditChange}
                          style={{
                            width: "100%",
                            boxSizing: "border-box",
                            padding: "11px",
                            border: "1px solid #ccc",
                            borderRadius: "7px",
                          }}
                        />
                      </div>

                      {/* DESCRIPTION */}

                      <div style={{ marginBottom: "15px" }}>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "6px",
                            fontWeight: "bold",
                          }}
                        >
                          Description
                        </label>

                        <textarea
                          name="description"
                          value={editTask.description}
                          onChange={handleEditChange}
                          rows="4"
                          style={{
                            width: "100%",
                            boxSizing: "border-box",
                            padding: "11px",
                            border: "1px solid #ccc",
                            borderRadius: "7px",
                            resize: "vertical",
                          }}
                        />
                      </div>

                      {/* PRIORITY */}

                      <div style={{ marginBottom: "15px" }}>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "6px",
                            fontWeight: "bold",
                          }}
                        >
                          Priority
                        </label>

                        <select
                          name="priority"
                          value={editTask.priority}
                          onChange={handleEditChange}
                          style={{
                            width: "100%",
                            padding: "11px",
                            border: "1px solid #ccc",
                            borderRadius: "7px",
                          }}
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </div>

                      {/* CATEGORY */}

                      <div style={{ marginBottom: "15px" }}>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "6px",
                            fontWeight: "bold",
                          }}
                        >
                          Category
                        </label>

                        <input
                          type="text"
                          name="category"
                          value={editTask.category}
                          onChange={handleEditChange}
                          style={{
                            width: "100%",
                            boxSizing: "border-box",
                            padding: "11px",
                            border: "1px solid #ccc",
                            borderRadius: "7px",
                          }}
                        />
                      </div>

                      {/* DUE DATE */}

                      <div style={{ marginBottom: "20px" }}>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "6px",
                            fontWeight: "bold",
                          }}
                        >
                          Due Date
                        </label>

                        <input
                          type="date"
                          name="dueDate"
                          value={editTask.dueDate}
                          onChange={handleEditChange}
                          style={{
                            width: "100%",
                            boxSizing: "border-box",
                            padding: "11px",
                            border: "1px solid #ccc",
                            borderRadius: "7px",
                          }}
                        />
                      </div>

                      {/* BUTTONS */}

                      <button
                        type="submit"
                        style={{
                          padding: "10px 18px",
                          border: "none",
                          borderRadius: "7px",
                          backgroundColor: "#16a34a",
                          color: "white",
                          cursor: "pointer",
                        }}
                      >
                        Save Changes
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditingTaskId(null)}
                        style={{
                          padding: "10px 18px",
                          marginLeft: "10px",
                          border: "1px solid #ccc",
                          borderRadius: "7px",
                          backgroundColor: "white",
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    /* =========================
       NORMAL TASK DISPLAY
       ========================= */

                    <>
                      <h3 style={{ marginTop: 0 }}>{task.title}</h3>

                      <p>{task.description || "No description"}</p>

                      <p>
                        <strong>Priority:</strong> {task.priority}
                      </p>

                      <p>
                        <strong>Category:</strong> {task.category}
                      </p>

                      <p>
                        <strong>Due Date:</strong>{" "}
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "No due date"}
                      </p>

                      <p>
                        <strong>Status:</strong> {task.status}
                      </p>

                      <div style={{ marginTop: "15px" }}>
                        {/* TOGGLE */}

                        <button
                          type="button"
                          onClick={() => handleToggleTask(task._id)}
                          style={{
                            padding: "9px 14px",
                            border: "none",
                            borderRadius: "7px",
                            backgroundColor: task.completed
                              ? "#f59e0b"
                              : "#16a34a",
                            color: "white",
                            cursor: "pointer",
                          }}
                        >
                          {task.completed ? "Mark Pending" : "Mark Complete"}
                        </button>

                        {/* EDIT */}

                        <button
                          type="button"
                          onClick={() => startEditingTask(task)}
                          style={{
                            padding: "9px 14px",
                            marginLeft: "10px",
                            border: "none",
                            borderRadius: "7px",
                            backgroundColor: "#2563eb",
                            color: "white",
                            cursor: "pointer",
                          }}
                        >
                          Edit
                        </button>

                        {/* DELETE */}

                        <button
                          type="button"
                          onClick={() => handleDeleteTask(task._id)}
                          style={{
                            padding: "9px 14px",
                            marginLeft: "10px",
                            border: "none",
                            borderRadius: "7px",
                            backgroundColor: "#dc2626",
                            color: "white",
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Dashboard;
