const Task = require("../models/Task");
const { sendTaskReminder } = require("./emailService");

const IST_OFFSET_MINUTES = 330; // UTC + 5:30

const checkAndSendReminders = async () => {
  try {
    const now = new Date();

    const tasks = await Task.find({
      status: "Pending",
      dueDate: { $ne: null },
      reminderSent: false,
    }).populate(
      "user",
      "email emailReminders reminderBefore"
    );

    console.log(
      `Found ${tasks.length} task(s) requiring reminder checks.`
    );

    for (const task of tasks) {
      // =========================
      // CHECK USER
      // =========================

      if (!task.user) {
        console.log(
          `Skipping task "${task.title}" - user not found.`
        );
        continue;
      }

      // =========================
      // CHECK EMAIL
      // =========================

      if (!task.user.email) {
        console.log(
          `Skipping task "${task.title}" - user email not found.`
        );
        continue;
      }

      // =========================
      // CHECK EMAIL OPT-IN
      // =========================

      if (task.user.emailReminders === false) {
        console.log(
          `Skipping task "${task.title}" - email reminders are disabled.`
        );
        continue;
      }

      // =========================
      // GET REMINDER SETTING
      // =========================

      const reminderBefore =
        Number(task.user.reminderBefore ?? 60);

      // =========================
      // BUILD DUE DATE/TIME AS IST
      // =========================

      const date = new Date(task.dueDate);

      const year = date.getUTCFullYear();
      const month = date.getUTCMonth();
      const day = date.getUTCDate();

      let hours = 0;
      let minutes = 0;

      if (task.dueTime) {
        const parts = task.dueTime.split(":").map(Number);

        hours = parts[0] || 0;
        minutes = parts[1] || 0;
      }

      /*
       * The task date/time entered by the user is IST.
       *
       * Example:
       * 2026-08-16 + 19:35
       *
       * means:
       * 2026-08-16 19:35 IST
       *
       * Convert that explicitly to UTC for comparison.
       */

      const dueDateTime = new Date(
        Date.UTC(
          year,
          month,
          day,
          hours,
          minutes
        ) - IST_OFFSET_MINUTES * 60 * 1000
      );

      // =========================
      // CALCULATE REMINDER TIME
      // =========================

      const reminderTime = new Date(
        dueDateTime.getTime() -
          reminderBefore * 60 * 1000
      );

      // =========================
      // DISPLAY TIMES IN IST
      // =========================

      const formatIST = (date) => {
        return date.toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          dateStyle: "short",
          timeStyle: "medium",
        });
      };

      console.log(
        `Task: "${task.title}" | ` +
        `Due: ${formatIST(dueDateTime)} IST | ` +
        `Reminder: ${formatIST(reminderTime)} IST | ` +
        `Now: ${formatIST(now)} IST`
      );

      // =========================
      // NOT YET TIME
      // =========================

      if (now < reminderTime) {
        console.log(
          `Not yet time for "${task.title}".`
        );
        continue;
      }

      // =========================
      // TASK ALREADY OVERDUE
      // =========================

      if (now > dueDateTime) {
        console.log(
          `Skipping "${task.title}" - task is already overdue.`
        );
        continue;
      }

      // =========================
      // SEND EMAIL
      // =========================

      try {
        await sendTaskReminder({
          to: task.user.email,
          taskTitle: task.title,
          dueDate: `${year}-${String(month + 1).padStart(
            2,
            "0"
          )}-${String(day).padStart(2, "0")}`,
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