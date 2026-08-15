import { useNavigate } from "react-router-dom";

function DashboardHeader({ user, onCreateClick, showCreateForm }) {
  
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* Welcome Header */}
      <div className="dashboard-header">
        <h1>Smart Task Manager</h1>

        <p>
          Welcome, {user?.name || "User"}!
        </p>
      </div>

      {/* Task Header */}
      <div className="task-header">
        <div className="task-header-content">
          <h2>My Tasks</h2>

          <button
            type="button"
            className="primary-button"
            onClick={onCreateClick}
          >
            {showCreateForm
              ? "Cancel"
              : "+ Create Task"}
          </button>

          <button
  type="button"
  onClick={handleLogout}
  className="logout-button"
>
  Logout
</button>
        </div>
      </div>
    </>
  );
}

export default DashboardHeader;