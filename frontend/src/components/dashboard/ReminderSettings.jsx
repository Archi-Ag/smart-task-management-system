import { useEffect, useState } from "react";
import api from "../../services/api";

function ReminderSettings() {
  const [emailReminders, setEmailReminders] = useState(true);
  const [reminderBefore, setReminderBefore] = useState(60);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReminderSettings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/users/reminder-settings"
        );

        setEmailReminders(
          response.data.emailReminders
        );

        setReminderBefore(
          response.data.reminderBefore
        );
      } catch (err) {
        console.error(
          "Fetch reminder settings error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load reminder settings"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReminderSettings();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      await api.put(
        "/users/reminder-settings",
        {
          emailReminders,
          reminderBefore: Number(reminderBefore),
        }
      );

      setMessage(
        "Reminder settings saved successfully."
      );

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      console.error(
        "Save reminder settings error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to save reminder settings"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="reminder-settings-card">
        <h3>📧 Email Reminder Settings</h3>
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="reminder-settings-card">
      <div className="reminder-settings-header">
        <div>
          <h3>📧 Email Reminder Settings</h3>
          <p>
            Choose whether you want to receive email
            reminders for your tasks.
          </p>
        </div>
      </div>

      <div className="reminder-setting-row">
        <div>
          <strong>Email reminders</strong>
          <p>
            Receive an email before a task is due.
          </p>
        </div>

        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={emailReminders}
            onChange={(e) =>
              setEmailReminders(e.target.checked)
            }
          />

          <span className="toggle-slider"></span>
        </label>
      </div>

      {emailReminders && (
        <div className="reminder-setting-row">
          <div>
            <strong>Remind me</strong>
            <p>
              Choose how early you want to receive
              the reminder.
            </p>
          </div>

          <select
            value={reminderBefore}
            onChange={(e) =>
              setReminderBefore(e.target.value)
            }
            className="reminder-select"
          >
            <option value="15">
              15 minutes before
            </option>

            <option value="30">
              30 minutes before
            </option>

            <option value="60">
              1 hour before
            </option>

            <option value="120">
              2 hours before
            </option>

            <option value="1440">
              24 hours before
            </option>
          </select>
        </div>
      )}

      {message && (
        <div className="reminder-success">
          {message}
        </div>
      )}

      {error && (
        <div className="reminder-error">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="primary-button reminder-save-button"
      >
        {saving
          ? "Saving..."
          : "Save Reminder Settings"}
      </button>
    </div>
  );
}

export default ReminderSettings;