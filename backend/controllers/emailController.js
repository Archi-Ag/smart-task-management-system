const { sendTaskReminder } = require("../services/emailService");
const { checkAndSendReminders } = require("../services/reminderService");

const sendTestEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Please provide an email address",
      });
    }

    await sendTaskReminder({
      to: email,
      taskTitle: "Test Email",
      dueDate: new Date().toISOString().split("T")[0],
    });

    res.status(200).json({
      message: "Test email sent successfully",
    });
  } catch (error) {
    console.error("Test email error:", error);

    res.status(500).json({
      message: "Failed to send test email",
    });
  }
};

const runReminderCheck = async (req, res) => {
  try {
    await checkAndSendReminders();

    res.status(200).json({
      message: "Reminder check completed successfully",
    });
  } catch (error) {
    console.error("Reminder check error:", error);

    res.status(500).json({
      message: "Failed to run reminder check",
    });
  }
};

module.exports = {
  sendTestEmail,
  runReminderCheck,
};