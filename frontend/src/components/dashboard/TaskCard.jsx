function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
}) {
  const isCompleted = task.status === "Completed";

  return (
    <div
      className={`task-card ${
        isCompleted ? "task-completed" : ""
      }`}
    >
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

      <p className="task-description">
        {task.description || "No description"}
      </p>

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
      </div>

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