import { useState } from "react";
import api from "../../services/api";

function AISummary() {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateSummary = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.post("/ai/summary");

      setSummary(response.data.summary);
    } catch (err) {
      console.error(
        "AI summary error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to generate AI summary"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-summary-card">
      <div className="ai-summary-header">
        <div>
          <h3>✨ AI Task Summary</h3>
          <p>
            Get an AI-powered overview of your current
            tasks and priorities.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGenerateSummary}
          disabled={loading}
          className="primary-button"
        >
          {loading
            ? "Generating..."
            : "✨ Generate Summary"}
        </button>
      </div>

      {error && (
        <div className="ai-summary-error">
          {error}
        </div>
      )}

      {summary && !error && (
        <div className="ai-summary-content">
          {summary.split("\n").map((line, index) => (
            <p key={index}>
              {line}
            </p>
          ))}
        </div>
      )}

      {!summary && !error && !loading && (
        <div className="ai-summary-placeholder">
          Click <strong>Generate Summary</strong> to get
          an AI-powered analysis of your tasks.
        </div>
      )}
    </div>
  );
}

export default AISummary;