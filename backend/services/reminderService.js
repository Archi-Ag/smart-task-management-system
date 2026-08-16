const Task = require("../models/Task");
const { sendTaskReminder } = require("./emailService");

const checkAndSendReminders = async () => {
  try {
    const now = new Date();

    // Look for pending tasks with a due date
    // that are due within the next 24 hours.
    const tomorrow = new Date(now);
    tomorrow.setHours(
      tomorrow.getHours() + 24
    );

    const tasks = await Task.find({
      status: "Pending",
      dueDate: {
        $gte: now,
        $lte: tomorrow,
      },
      reminderSent: false,
    }).populate("user", "email");

    console.log(
      `Found ${tasks.length} task(s) requiring reminders.`
    );

    for (const task of tasks) {
      if (!task.user?.email) {
        console.log(
          `Skipping task "${task.title}" - user email not found.`
        );
        continue;
      }

      try {
        await sendTaskReminder({
          to: task.user.email,
          taskTitle: task.title,
          dueDate: task.dueDate
            .toISOString()
            .split("T")[0],
        });

        task.reminderSent = true;

        await task.save();

        console.log(
          `Reminder sent for task: ${task.title}`
        );
      } catch (emailError) {
        console.error(
          `Failed to send reminder for "${task.title}":`,
          emailError.message
        );
      }
    }
  } catch (error) {
    console.error(
      "Reminder service error:",
      error
    );
  }
};

module.exports = {
  checkAndSendReminders,
};