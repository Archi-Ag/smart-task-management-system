function TaskStats({ tasks }) {
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  const highPriorityTasks = tasks.filter(
    (task) => task.priority === "High"
  ).length;

  return (
    <div className="stats-grid">

      <div className="stat-card">
        <div className="stat-icon">📋</div>

        <div>
          <h4>Total Tasks</h4>
          <p>{totalTasks}</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">⏳</div>

        <div>
          <h4>Pending</h4>
          <p>{pendingTasks}</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">✓</div>

        <div>
          <h4>Completed</h4>
          <p>{completedTasks}</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">⚡</div>

        <div>
          <h4>High Priority</h4>
          <p>{highPriorityTasks}</p>
        </div>
      </div>

    </div>
  );
}

export default TaskStats;