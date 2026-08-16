const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendTaskReminder = async ({
  to,
  taskTitle,
  dueDate,
}) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `Task Reminder: ${taskTitle}`,
    text: `
Hello,

This is a reminder for your task:

Task: ${taskTitle}
Due Date: ${dueDate}

Please make sure to complete it on time.

Smart Task Manager
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendTaskReminder,
};