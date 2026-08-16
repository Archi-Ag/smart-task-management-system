function EditTaskForm({
  editTask,
  handleEditChange,
  handleUpdateTask,
  onCancel,
}) {
  return (
    <form
      onSubmit={handleUpdateTask}
      className="form-card"
    >
      <h3>Edit Task</h3>

      <div className="form-group">
        <label>Task Title</label>

        <input
          type="text"
          name="title"
          value={editTask.title}
          onChange={handleEditChange}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>Description</label>

        <textarea
          name="description"
          value={editTask.description}
          onChange={handleEditChange}
          rows="4"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>Priority</label>

        <select
          name="priority"
          value={editTask.priority}
          onChange={handleEditChange}
          className="form-input"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div className="form-group">
        <label>Category</label>

        <input
          type="text"
          name="category"
          value={editTask.category}
          onChange={handleEditChange}
          className="form-input"
        />
      </div>

      <div className="form-group due-date-group">
        <label>Due Date</label>

        <input
          type="date"
          name="dueDate"
          value={editTask.dueDate}
          onChange={handleEditChange}
          className="form-input"
        />
      </div>

      <div className="form-group">
  <label>Due Time</label>

  <input
    type="time"
    name="dueTime"
    value={editTask.dueTime || ""}
    onChange={handleEditChange}
  />
</div>

      <div className="form-buttons">
        <button
          type="submit"
          className="success-button"
        >
          Save Changes
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
  );
}

export default EditTaskForm;