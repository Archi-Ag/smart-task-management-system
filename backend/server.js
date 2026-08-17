const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const aiRoutes = require("./routes/aiRoutes");
const emailRoutes = require("./routes/emailRoutes");
const subtaskRoutes = require("./routes/subtaskRoutes");
const userRoutes = require("./routes/userRoutes");

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
    "https://smart-task-management-system-h88wz6rch-archi-ags-projects.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// app.use(
//   cors({
//     origin: "*"
//   })
// );

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
app.use("/api/subtasks", subtaskRoutes);
app.use("/api/users", userRoutes);

// ===============================
// ROOT
// ===============================
app.get("/", (req, res) => {
  res.json({
    message: "Smart Task Management API is running"
  });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);

  startReminderScheduler();
  
});
