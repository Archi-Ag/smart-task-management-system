const express = require("express");
const router = express.Router();

const { sendTestEmail,
    runReminderCheck,
 } = require("../controllers/emailController");
 
const { protect } = require("../middleware/authMiddleware");

router.post("/test", protect, sendTestEmail);
router.post("/check-reminders", protect, runReminderCheck);

module.exports = router;