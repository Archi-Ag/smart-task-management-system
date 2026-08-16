const Task = require("../models/Task");

// Create a new task
const createTask = async (req, res) => {
  try {
    const {
  title,
  description,
  priority,
  category,
  dueDate,
  dueTime
} = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Task title is required"
      });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      category,
      dueDate,
      dueTime,
      user: req.user.userId
    });

    res.status(201).json({
      message: "Task created successfully",
      task
    });
  } catch (error) {
    console.error("Create task error:", error);

    res.status(500).json({
      message: "Server error while creating task"
    });
  }
};

// Get all tasks for logged-in user
const getTasks = async (req, res) => {
  try {
    const { search, status, priority, category } = req.query;

    const filter = {
      user: req.user.userId
    };

    // Search by title or description
    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i"
          }
        },
        {
          description: {
            $regex: search,
            $options: "i"
          }
        }
      ];
    }

    // Filter by status
    if (status) {
      filter.status = status;
    }

    // Filter by priority
    if (priority) {
      filter.priority = priority;
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    const tasks = await Task.find(filter).sort({
      createdAt: -1
    });

    res.status(200).json({
      count: tasks.length,
      tasks
    });
  } catch (error) {
    console.error("Get tasks error:", error);

    res.status(500).json({
      message: "Server error while fetching tasks"
    });
  }
};

// Get one task
const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json({
      task
    });
  } catch (error) {
    console.error("Get task error:", error);

    res.status(500).json({
      message: "Server error while fetching task"
    });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const {
  title,
  description,
  status,
  priority,
  category,
  dueDate,
  dueTime
} = req.body;

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    if (status !== undefined) {
  const statusChanged =
    status !== task.status;

  task.status = status;

  if (
    statusChanged &&
    status === "Pending"
  ) {
    task.reminderSent = false;
  }
}
    task.priority = priority ?? task.priority;
    task.category = category ?? task.category;
    if (dueDate !== undefined || dueTime !== undefined) {
  const dueDateChanged =
    dueDate !== undefined &&
    String(dueDate || "") !==
      String(task.dueDate || "");

  const dueTimeChanged =
    dueTime !== undefined &&
    String(dueTime || "") !==
      String(task.dueTime || "");

  if (dueDate !== undefined) {
    task.dueDate = dueDate;
  }

  if (dueTime !== undefined) {
    task.dueTime = dueTime;
  }

  if (dueDateChanged || dueTimeChanged) {
    task.reminderSent = false;
  }
}

    const updatedTask = await task.save();

    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask
    });
  } catch (error) {
    console.error("Update task error:", error);

    res.status(500).json({
      message: "Server error while updating task"
    });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    await task.deleteOne();

    res.status(200).json({
      message: "Task deleted successfully"
    });
  } catch (error) {
    console.error("Delete task error:", error);

    res.status(500).json({
      message: "Server error while deleting task"
    });
  }
};

// Toggle task status
const toggleTaskStatus = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    task.status =
      task.status === "Completed" ? "Pending" : "Completed";

    const updatedTask = await task.save();

    res.status(200).json({
      message: "Task status updated successfully",
      task: updatedTask
    });
  } catch (error) {
    console.error("Toggle status error:", error);

    res.status(500).json({
      message: "Server error while updating task status"
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  toggleTaskStatus
};