import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

import Sidebar from "../components/layout/Sidebar";
import TaskStats from "../components/dashboard/TaskStats";
import AISummary from "../components/dashboard/AISummary";

import "../styles/dashboard.css";
import "../styles/layout.css";

function Overview() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // GET TASKS
  // =========================

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/tasks");
      const data = response.data;

      const taskList = Array.isArray(data)
        ? data
        : Array.isArray(data.tasks)
          ? data.tasks
          : [];

      setTasks(taskList);
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
  // UPCOMING TASKS
  // =========================

  const upcomingTasks = tasks
    .filter((task) => task.status !== "Completed")
    .sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;

      return (
        new Date(a.dueDate).getTime() -
        new Date(b.dueDate).getTime()
      );
    })
    .slice(0, 4);

  return (
    <div className="app-layout">
      <Sidebar user={user} />

      <main className="app-main">
        <div className="overview-page">

          {/* =========================
              PAGE HEADER
          ========================= */}

          <header className="overview-header">
            <div>
              <p className="overview-eyebrow">
                OVERVIEW
              </p>

              <h1>
                Welcome back, {user?.name || "User"} 👋
              </h1>

              <p>
                Here's what's happening with your tasks today.
              </p>
            </div>

            <button
              type="button"
              className="primary-button"
              onClick={() => navigate("/tasks")}
            >
              + Manage Tasks
            </button>
          </header>

          {/* =========================
              TASK STATISTICS
          ========================= */}

          <section className="overview-section">
            <div className="overview-section-header">
              <div>
                <h2>Task Overview</h2>

                <p>
                  A quick look at your current productivity.
                </p>
              </div>
            </div>

            <TaskStats tasks={tasks} />
          </section>

          {/* =========================
              AI SUMMARY
          ========================= */}

          <section className="overview-section">
            <div className="overview-section-header">
              <div>
                <h2>AI Productivity Summary</h2>

                <p>
                  Get an intelligent summary of your current workload.
                </p>
              </div>
            </div>

            <AISummary />
          </section>

          {/* =========================
              UPCOMING TASKS
          ========================= */}

          <section className="overview-section">
            <div className="overview-section-header">
              <div>
                <h2>Upcoming Tasks</h2>

                <p>
                  Tasks that still need your attention.
                </p>
              </div>

              <button
                type="button"
                className="secondary-button"
                onClick={() => navigate("/tasks")}
              >
                View all →
              </button>
            </div>

            {loading ? (
              <div className="overview-empty">
                <p>Loading your tasks...</p>
              </div>
            ) : error ? (
              <div className="overview-empty">
                <h3>Unable to load tasks</h3>

                <p>{error}</p>

                <button
                  type="button"
                  className="primary-button"
                  onClick={fetchTasks}
                >
                  Try Again
                </button>
              </div>
            ) : upcomingTasks.length === 0 ? (
              <div className="overview-empty">
                <div className="overview-empty-icon">
                  ✓
                </div>

                <h3>You're all caught up!</h3>

                <p>
                  You don't have any pending tasks right now.
                </p>

                <button
                  type="button"
                  className="primary-button"
                  onClick={() => navigate("/tasks")}
                >
                  Create a Task
                </button>
              </div>
            ) : (
              <div className="overview-task-grid">
                {upcomingTasks.map((task) => (
                  <div
                    key={task._id}
                    className="overview-task-card"
                  >
                    <div className="overview-task-content">
                      <div className="overview-task-title-row">
                        <h3>{task.title}</h3>

                        <span
                          className={`priority-badge priority-${(
                            task.priority || "Medium"
                          ).toLowerCase()}`}
                        >
                          {task.priority || "Medium"}
                        </span>
                      </div>

                      <p>
                        {task.description ||
                          "No description available."}
                      </p>

                      <div className="overview-task-meta">
                        <span>
                          📁 {task.category || "General"}
                        </span>

                        <span>
                          📅{" "}
                          {task.dueDate
                            ? new Date(
                                task.dueDate
                              ).toLocaleDateString()
                            : "No due date"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
}

export default Overview;