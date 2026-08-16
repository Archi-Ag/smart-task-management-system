const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const aiRoutes = require("./routes/aiRoutes");
const emailRoutes = require("./routes/emailRoutes");
const {
  startReminderScheduler,
} = require("./services/reminderScheduler");

dotenv.config();

connectDB();

const app = express();


// ===============================
// CORS
// ===============================
app.use(cors({
  origin: [
      "https://reimagined-sniffle-x5w4v6xxppgj36wqx-5173.app.github.dev",
      "https://reimagined-sniffle-x5w4v6xxppgj36wqx-5174.app.github.dev"
    ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ===============================
// JSON
// ===============================
app.use(express.json());


// ===============================
// ROUTES
// ===============================
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/email", emailRoutes);

// ===============================
// ROOT
// ===============================
app.get("/", (req, res) => {
  res.json({
    message: "Smart Task Management API is running"
  });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  startReminderScheduler();
  
});
