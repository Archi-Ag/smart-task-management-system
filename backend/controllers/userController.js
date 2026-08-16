const User = require("../models/User");

// =========================
// GET REMINDER SETTINGS
// =========================

const getReminderSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "email emailReminders reminderBefore"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      email: user.email,
      emailReminders: user.emailReminders,
      reminderBefore: user.reminderBefore
    });
  } catch (error) {
    console.error("Get reminder settings error:", error);

    res.status(500).json({
      message: "Server error while getting reminder settings"
    });
  }
};

// =========================
// UPDATE REMINDER SETTINGS
// =========================

const updateReminderSettings = async (req, res) => {
  try {
    const { emailReminders, reminderBefore } = req.body;

    if (
      typeof emailReminders !== "boolean"
    ) {
      return res.status(400).json({
        message: "emailReminders must be true or false"
      });
    }

    const allowedTimes = [0, 15, 30, 60, 1440];

    if (
      !allowedTimes.includes(Number(reminderBefore))
    ) {
      return res.status(400).json({
        message:
          "Invalid reminder time. Choose 0, 15, 30, 60, or 1440 minutes."
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        emailReminders,
        reminderBefore: Number(reminderBefore)
      },
      {
        new: true,
        runValidators: true
      }
    ).select("email emailReminders reminderBefore");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "Reminder settings updated successfully",
      settings: {
        email: user.email,
        emailReminders: user.emailReminders,
        reminderBefore: user.reminderBefore
      }
    });
  } catch (error) {
    console.error(
      "Update reminder settings error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while updating reminder settings"
    });
  }
};

module.exports = {
  getReminderSettings,
  updateReminderSettings
};