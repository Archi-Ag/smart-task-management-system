function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={{ padding: "40px" }}>
      <h1>Smart Task Manager</h1>

      <p>
        Welcome, {user?.name || "User"}!
      </p>

      <p>
        Dashboard coming next...
      </p>
    </div>
  );
}

export default Dashboard;