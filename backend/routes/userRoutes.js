const express = require("express");

const {
  getReminderSettings,
  updateReminderSettings
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/reminder-settings",
  protect,
  getReminderSettings
);

router.put(
  "/reminder-settings",
  protect,
  updateReminderSettings
);

module.exports = router;