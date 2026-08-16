import { useState } from "react";
import api from "../../services/api";

function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
  onTaskUpdated,
}) {
  const isCompleted = task.status === "Completed";

  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [addingSubtask, setAddingSubtask] = useState(false);

  const [editingSubtaskId, setEditingSubtaskId] = useState(null);
  const [editingSubtaskTitle, setEditingSubtaskTitle] = useState("");

  // =========================
  // ADD SUBTASK
  // =========================

  const handleAddSubtask = async () => {
    if (!newSubtaskTitle.trim()) {
      return;
    }

    try {
      setAddingSubtask(true);

      const response = await api.post(
        `/subtasks/${task._id}`,
        {
          title: newSubtaskTitle.trim(),
        }
      );

      onTaskUpdated(response.data.task);

      setNewSubtaskTitle("");
    } catch (error) {
      console.error("Add subtask error:", error);
      alert("Failed to add subtask");
    } finally {
      setAddingSubtask(false);
    }
  };

  // =========================
  // TOGGLE SUBTASK
  // =========================

  const handleToggleSubtask = async (subtaskId) => {
    try {
      const response = await api.patch(
        `/subtasks/${task._id}/${subtaskId}`
      );

      onTaskUpdated(response.data.task);
    } catch (error) {
      console.error("Toggle subtask error:", error);
      alert("Failed to update subtask");
    }
  };

  // =========================
  // EDIT SUBTASK
  // =========================

  const handleEditSubtask = (subtask) => {
    setEditingSubtaskId(subtask._id);
    setEditingSubtaskTitle(subtask.title);
  };

  const handleSaveSubtask = async (subtaskId) => {
    if (!editingSubtaskTitle.trim()) {
      return;
    }

    try {
      const response = await api.patch(
        `/subtasks/${task._id}/${subtaskId}/edit`,
        {
          title: editingSubtaskTitle.trim(),
        }
      );

      onTaskUpdated(response.data.task);

      setEditingSubtaskId(null);
      setEditingSubtaskTitle("");
    } catch (error) {
      console.error("Edit subtask error:", error);
      alert("Failed to update subtask");
    }
  };

  // =========================
  // DELETE SUBTASK
  // =========================

  const handleDeleteSubtask = async (subtaskId) => {
    try {
      const response = await api.delete(
        `/subtasks/${task._id}/${subtaskId}`
      );

      onTaskUpdated(response.data.task);
    } catch (error) {
      console.error("Delete subtask error:", error);
      alert("Failed to delete subtask");
    }
  };

  // =========================
  // CANCEL EDIT
  // =========================

  const handleCancelEditSubtask = () => {
    setEditingSubtaskId(null);
    setEditingSubtaskTitle("");
  };

  return (
    <div
      className={`task-card ${
        isCompleted ? "task-completed" : ""
      }`}
    >
      {/* =========================
          TASK HEADER
      ========================= */}

      <div className="task-card-header">
        <h3>{task.title}</h3>

        <span
          className={`status-badge ${
            isCompleted
              ? "status-completed"
              : "status-pending"
          }`}
        >
          {isCompleted ? "Completed" : "Pending"}
        </span>
      </div>

      {/* =========================
          DESCRIPTION
      ========================= */}

      <p className="task-description">
        {task.description || "No description"}
      </p>

      {/* =========================
          TASK DETAILS
      ========================= */}

      <div className="task-details">
        <div>
          <strong>Priority</strong>

          <span
            className={`priority-badge priority-${(
              task.priority || "Medium"
            ).toLowerCase()}`}
          >
            {task.priority || "Medium"}
          </span>
        </div>

        <div>
          <strong>Category</strong>

          <span className="category-badge">
            {task.category || "General"}
          </span>
        </div>

        <div>
          <strong>Due Date</strong>

          <span>
            {task.dueDate
              ? new Date(
                  task.dueDate
                ).toLocaleDateString()
              : "No due date"}
          </span>
        </div>

        <div>
          <strong>Due Time</strong>

          <span>
            {task.dueTime || "No due time"}
          </span>
        </div>
      </div>

      {/* =========================
          SUBTASKS
      ========================= */}

      <div className="subtasks-section">
        <div className="subtasks-header">
          <h4>
            Subtasks (
            {task.subtasks
              ? task.subtasks.filter(
                  (subtask) => subtask.completed
                ).length
              : 0}
            /
            {task.subtasks
              ? task.subtasks.length
              : 0}
            )
          </h4>
        </div>

        {/* SUBTASK LIST */}

        {task.subtasks &&
          task.subtasks.length > 0 && (
            <div className="subtask-list">
              {task.subtasks.map((subtask) => (
                <div
                  key={subtask._id}
                  className="subtask-item"
                >
                  {editingSubtaskId ===
                  subtask._id ? (
                    /* =========================
                       EDIT MODE
                    ========================= */

                    <div className="subtask-edit">
                      <input
                        type="text"
                        value={editingSubtaskTitle}
                        onChange={(e) =>
                          setEditingSubtaskTitle(
                            e.target.value
                          )
                        }
                        className="form-input"
                        autoFocus
                      />

                      <button
                        type="button"
                        onClick={() =>
                          handleSaveSubtask(
                            subtask._id
                          )
                        }
                        className="success-button"
                      >
                        Save
                      </button>

                      <button
                        type="button"
                        onClick={
                          handleCancelEditSubtask
                        }
                        className="cancel-button"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    /* =========================
                       NORMAL MODE
                    ========================= */

                    <>
                      <span
                        className={
                          subtask.completed
                            ? "subtask-completed"
                            : ""
                        }
                      >
                        {subtask.completed
                          ? "☑"
                          : "☐"}{" "}
                        {subtask.title}
                      </span>

                      <div className="subtask-actions">
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleSubtask(
                              subtask._id
                            )
                          }
                          className={
                            subtask.completed
                              ? "warning-button"
                              : "success-button"
                          }
                        >
                          {subtask.completed
                            ? "Mark Pending"
                            : "Mark Complete"}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleEditSubtask(
                              subtask
                            )
                          }
                          className="primary-button"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteSubtask(
                              subtask._id
                            )
                          }
                          className="danger-button"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

        {/* =========================
            ADD SUBTASK
        ========================= */}

        <div className="add-subtask">
          <input
            type="text"
            placeholder="Add a subtask..."
            value={newSubtaskTitle}
            onChange={(e) =>
              setNewSubtaskTitle(e.target.value)
            }
            className="form-input"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddSubtask();
              }
            }}
          />

          <button
            type="button"
            onClick={handleAddSubtask}
            disabled={addingSubtask}
            className="success-button"
          >
            {addingSubtask
              ? "Adding..."
              : "+ Add Subtask"}
          </button>
        </div>
      </div>

      {/* =========================
          MAIN TASK ACTIONS
      ========================= */}

      <div className="task-actions">
        <button
          type="button"
          onClick={() => onToggle(task._id)}
          className={
            isCompleted
              ? "warning-button"
              : "success-button"
          }
        >
          {isCompleted
            ? "Mark Pending"
            : "Mark Complete"}
        </button>

        <button
          type="button"
          onClick={() => onEdit(task)}
          className="primary-button"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete(task._id)}
          className="danger-button"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
