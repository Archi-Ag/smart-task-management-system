import { useLocation, useNavigate } from "react-router-dom";

function Sidebar({ user }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  const navigationItems = [
    {
      label: "Overview",
      icon: "🏠",
      path: "/dashboard",
    },
    {
      label: "My Tasks",
      icon: "📋",
      path: "/tasks",
    },
    {
      label: "Settings",
      icon: "⚙️",
      path: "/settings",
    },
  ];

  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">✓</div>

        <div>
          <h2>Smart Tasks</h2>
          <span>Task Manager</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="sidebar-section-title">MENU</p>

        {navigationItems.map((item) => {
          const isActive =
            location.pathname === item.path;

          return (
            <button
              key={item.path}
              type="button"
              className={`sidebar-nav-item ${
                isActive ? "active" : ""
              }`}
              onClick={() => navigate(item.path)}
            >
              <span className="sidebar-nav-icon">
                {item.icon}
              </span>

              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {(user?.name || "U")
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="sidebar-user-info">
            <strong>
              {user?.name || "User"}
            </strong>

            <span>
              {user?.email || ""}
            </span>
          </div>
        </div>

        <button
  type="button"
  className="sidebar-logout"
  onClick={handleLogout}
  title="Logout"
>
  <span className="sidebar-logout-icon">
    ↪
  </span>

  <span className="sidebar-logout-text">
    Logout
  </span>
</button>
      </div>
    </aside>
  );
}

export default Sidebar;