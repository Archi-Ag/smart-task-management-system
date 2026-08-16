import { useEffect, useState } from "react";

function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);

    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  return (
    <button
      type="button"
      onClick={() => setDarkMode((previous) => !previous)}
      className="theme-toggle"
      aria-label="Toggle dark mode"
    >
      {darkMode ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}

export default ThemeToggle;