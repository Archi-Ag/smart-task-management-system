import { useEffect, useState } from "react";

import Sidebar from "../components/layout/Sidebar";
import ThemeToggle from "../components/layout/ThemeToggle";

import "../styles/layout.css";
import "../styles/dashboard.css";

function Settings() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // =========================
  // REMINDER SETTINGS
  // =========================

  const [remindersEnabled, setRemindersEnabled] =
    useState(() => {
      const saved =
        localStorage.getItem("remindersEnabled");

      return saved === null
        ? true
        : saved === "true";
    });

  const [reminderTime, setReminderTime] =
    useState(() => {
      return (
        localStorage.getItem("reminderTime") ||
        "15"
      );
    });

  const [reminderSaved, setReminderSaved] =
    useState(false);

  // =========================
  // SAVE REMINDER SETTINGS
  // =========================

  useEffect(() => {
    localStorage.setItem(
      "remindersEnabled",
      remindersEnabled
    );

    localStorage.setItem(
      "reminderTime",
      reminderTime
    );
  }, [remindersEnabled, reminderTime]);

  const handleSaveReminders = () => {
    localStorage.setItem(
      "remindersEnabled",
      remindersEnabled
    );

    localStorage.setItem(
      "reminderTime",
      reminderTime
    );

    setReminderSaved(true);

    setTimeout(() => {
      setReminderSaved(false);
    }, 2500);
  };

  return (
    <div className="app-layout">
      <Sidebar user={user} />

      <main className="app-main">
        <div className="overview-page">

          {/* =========================
              PAGE HEADER
          ========================= */}

          <div className="overview-header">
            <div>
              <p className="overview-eyebrow">
                SETTINGS
              </p>

              <h1>Settings</h1>

              <p>
                Manage your Smart Task Manager
                preferences.
              </p>
            </div>
          </div>

          {/* =========================
              APPEARANCE
          ========================= */}

          <section className="overview-section">
            <div className="settings-card">

              <div className="settings-card-header">
                <h2>Appearance</h2>

                <p>
                  Choose how Smart Task Manager
                  looks.
                </p>
              </div>

              <div className="settings-row">
                <div>
                  <h3>Theme</h3>

                  <p>
                    Switch between light and
                    dark mode.
                  </p>
                </div>

                <ThemeToggle />
              </div>

            </div>
          </section>

          {/* =========================
              REMINDER SETTINGS
          ========================= */}

          <section className="overview-section">
            <div className="reminder-settings-card">

              <div className="reminder-settings-header">
                <h3>
                  🔔 Reminder Settings
                </h3>

                <p>
                  Choose when you want to be
                  reminded about upcoming tasks.
                </p>
              </div>

              {/* ENABLE REMINDERS */}

              <div className="reminder-setting-row">
                <div>
                  <h3>
                    Task Reminders
                  </h3>

                  <p>
                    Receive reminders for
                    upcoming tasks.
                  </p>
                </div>

                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={remindersEnabled}
                    onChange={(e) =>
                      setRemindersEnabled(
                        e.target.checked
                      )
                    }
                  />

                  <span className="toggle-slider"></span>
                </label>
              </div>

              {/* REMINDER TIME */}

              <div className="reminder-setting-row">
                <div>
                  <h3>
                    Reminder Time
                  </h3>

                  <p>
                    How early should you be
                    reminded before a task?
                  </p>
                </div>

                <select
                  className="reminder-select"
                  value={reminderTime}
                  onChange={(e) =>
                    setReminderTime(
                      e.target.value
                    )
                  }
                  disabled={!remindersEnabled}
                >
                  <option value="5">
                    5 minutes before
                  </option>

                  <option value="15">
                    15 minutes before
                  </option>

                  <option value="30">
                    30 minutes before
                  </option>

                  <option value="60">
                    1 hour before
                  </option>

                  <option value="1440">
                    1 day before
                  </option>
                </select>
              </div>

              {/* SAVE */}

              <button
                type="button"
                className="primary-button reminder-save-button"
                onClick={handleSaveReminders}
              >
                Save Reminder Settings
              </button>

              {reminderSaved && (
                <div className="reminder-success">
                  ✓ Reminder settings saved
                  successfully.
                </div>
              )}

            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

export default Settings;