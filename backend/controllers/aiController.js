require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env")
});

const OpenAI = require("openai");

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

const resolveDueDate = (dateText) => {
  if (!dateText) {
    return null;
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const text = dateText.toLowerCase().trim();

  // Tomorrow
  if (text === "tomorrow") {
    const date = new Date(today);
    date.setDate(date.getDate() + 1);

    return date.toISOString().split("T")[0];
  }

  // Today
  if (text === "today") {
    return today.toISOString().split("T")[0];
  }

  // Weekdays
  const weekdays = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6
  };

  if (weekdays[text] !== undefined) {
    const targetDay = weekdays[text];
    const currentDay = today.getDay();

    let daysUntil = targetDay - currentDay;

    if (daysUntil <= 0) {
      daysUntil += 7;
    }

    const date = new Date(today);
    date.setDate(date.getDate() + daysUntil);

    return date.toISOString().split("T")[0];
  }

  // Specific date already provided by AI
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return text;
  }

  return null;
};

const generateTask = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        message: "Please provide a task description"
      });
    }

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content: `
You are an AI task management assistant.

Convert the user's natural-language request into a structured task.

Return ONLY valid JSON.
Do not use markdown.
Do not add explanations.

The JSON must contain exactly these fields:

{
  "title": "short task title",
  "description": "clear task description",
  "priority": "Low, Medium, or High",
  "category": "Work, Personal, Study, Health, Shopping, or Other",
  "dueDate": "specific date in YYYY-MM-DD format, or null",
  "dueDateText": "original date phrase such as Friday, tomorrow, next week, or null"
}

Rules:
- Create a concise title.
- Keep the description useful.
- Choose priority based on urgency and importance.
- Choose the most appropriate category.
- Identify any due date mentioned by the user.
- If the user mentions a specific date, return it as YYYY-MM-DD.
- If the user mentions a relative date or weekday, return the date phrase exactly as understood, rather than calculating it.
- If no due date is mentioned, use null.
`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2
    });

    const responseText = completion.choices[0].message.content;

    let task;

    try {
      task = JSON.parse(responseText);
    } catch (error) {
      console.error("AI JSON parsing error:", responseText);

      return res.status(500).json({
        message: "AI returned an invalid response"
      });
    }

    const resolvedDueDate =
      task.dueDate || resolveDueDate(task.dueDateText);

    task.dueDate = resolvedDueDate;

    res.status(200).json({
      message: "Task generated successfully",
      task
    });

  } catch (error) {
    console.error("AI task generation error:", error);

    res.status(500).json({
      message: "Failed to generate task using AI"
    });
  }
};

module.exports = {
  generateTask
};