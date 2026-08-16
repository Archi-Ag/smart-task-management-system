import { useState } from "react";

const API_URL =
  "https://reimagined-sniffle-x5w4v6xxppgj36wqx-5000.app.github.dev";

function CreateTaskForm({
  newTask,
  handleChange,
  handleCreateTask,
  onCancel,
}) {
  const token = localStorage.getItem("token");

  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) {
      setAiError("Please describe the task first.");
      return;
    }

    setAiLoading(true);
    setAiError("");

    try {
      const response = await fetch(
        `${API_URL}/api/ai/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            prompt: aiPrompt,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to generate task"
        );
      }

      const generatedTask = data.task;

      // Fill the existing Create Task form
      handleChange({
        target: {
          name: "title",
          value: generatedTask.title || "",
        },
      });

      handleChange({
        target: {
          name: "description",
          value: generatedTask.description || "",
        },
      });

      handleChange({
        target: {
          name: "priority",
          value: generatedTask.priority || "Medium",
        },
      });

      handleChange({
        target: {
          name: "category",
          value: generatedTask.category || "Other",
        },
      });

      handleChange({
        target: {
          name: "dueDate",
          value: generatedTask.dueDate || "",
        },
      });

      setAiPrompt("");
    } catch (error) {
      console.error("AI generation error:", error);

      setAiError(
        error.message || "Failed to generate task"
      );
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="form-card">
      <h3>Create New Task</h3>

      {/* AI TASK GENERATOR */}

      <div className="ai-generator">
        <label>
          ✨ Generate Task with AI
        </label>

        <textarea
          value={aiPrompt}
          onChange={(e) =>
            setAiPrompt(e.target.value)
          }
          placeholder="Example: Finish my project report by Friday and send it to my manager"
          rows="3"
          className="form-input"
        />

        <button
          type="button"
          onClick={handleGenerateAI}
          disabled={aiLoading}
          className="ai-button"
        >
          {aiLoading
            ? "Generating..."
            : "✨ Generate with AI"}
        </button>

        {aiError && (
          <div className="ai-error">
            {aiError}
          </div>
        )}
      </div>

      <div className="ai-divider">
        <span>OR ENTER MANUALLY</span>
      </div>

      {/* NORMAL CREATE FORM */}

      <form onSubmit={handleCreateTask}>
        {/* TITLE */}

        <div className="form-group">
          <label>Task Title</label>

          <input
            type="text"
            name="title"
            placeholder="Enter task title"
            value={newTask.title}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        {/* DESCRIPTION */}

        <div className="form-group">
          <label>Description</label>

          <textarea
            name="description"
            placeholder="Describe the task"
            value={newTask.description}
            onChange={handleChange}
            rows="4"
            className="form-input"
          />
        </div>

        {/* PRIORITY */}

        <div className="form-group">
          <label>Priority</label>

          <select
            name="priority"
            value={newTask.priority}
            onChange={handleChange}
            className="form-input"
          >
            <option value="Low">Low</option>
            <option value="Medium">
              Medium
            </option>
            <option value="High">High</option>
          </select>
        </div>

        {/* CATEGORY */}

        <div className="form-group">
          <label>Category</label>

          <input
            type="text"
            name="category"
            placeholder="e.g. Work, Personal, Study"
            value={newTask.category}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        {/* DUE DATE */}

        <div className="form-group due-date-group">
          <label>Due Date</label>

          <input
            type="date"
            name="dueDate"
            value={newTask.dueDate}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
  <label>Due Time</label>

  <input
    type="time"
    name="dueTime"
    value={newTask.dueTime}
    onChange={handleChange}
  />
</div>

        {/* FORM BUTTONS */}

        <div className="form-buttons">
          <button
            type="submit"
            className="success-button"
          >
            Save Task
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateTaskForm;