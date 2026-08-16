const cron = require("node-cron");
const { checkAndSendReminders } = require("./reminderService");

const startReminderScheduler = () => {
  // Run every 1 minutes
  cron.schedule("*/1 * * * *", async () => {
    console.log("Running automatic task reminder check...");

    await checkAndSendReminders();
  });

  console.log("Task reminder scheduler started.");
};

module.exports = {
  startReminderScheduler,
};