const Task = require("../models/Task");

// Add a subtask
const addSubtask = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Subtask title is required"
      });
    }

    const task = await Task.findOne({
      _id: req.params.taskId,
      user: req.user.userId
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    task.subtasks.push({
      title: title.trim(),
      completed: false
    });

    await task.save();

    res.status(201).json({
      message: "Subtask added successfully",
      task
    });
  } catch (error) {
    console.error("Add subtask error:", error);

    res.status(500).json({
      message: "Server error while adding subtask"
    });
  }
};


// Toggle subtask
const toggleSubtask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.taskId,
      user: req.user.userId
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    const subtask = task.subtasks.id(
      req.params.subtaskId
    );

    if (!subtask) {
      return res.status(404).json({
        message: "Subtask not found"
      });
    }

    // Toggle the selected subtask
    subtask.completed = !subtask.completed;

    // ==========================================
    // AUTO-COMPLETE PARENT TASK
    // ==========================================

    if (task.subtasks.length > 0) {
      const allSubtasksCompleted =
        task.subtasks.every(
          (item) => item.completed === true
        );

      if (allSubtasksCompleted) {
        task.status = "Completed";
      } else {
        task.status = "Pending";
      }
    }

    await task.save();

    res.status(200).json({
      message: "Subtask status updated successfully",
      task
    });
  } catch (error) {
    console.error(
      "Toggle subtask error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while updating subtask status"
    });
  }
};

// Delete a subtask
const deleteSubtask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.taskId,
      user: req.user.userId
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    const subtask = task.subtasks.id(req.params.subtaskId);

    if (!subtask) {
      return res.status(404).json({
        message: "Subtask not found"
      });
    }

    subtask.deleteOne();

    await task.save();

    res.status(200).json({
      message: "Subtask deleted successfully",
      task
    });
  } catch (error) {
    console.error("Delete subtask error:", error);

    res.status(500).json({
      message: "Server error while deleting subtask"
    });
  }
};

// Edit a subtask
const updateSubtask = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Subtask title is required"
      });
    }

    const task = await Task.findOne({
      _id: req.params.taskId,
      user: req.user.userId
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    const subtask = task.subtasks.id(req.params.subtaskId);

    if (!subtask) {
      return res.status(404).json({
        message: "Subtask not found"
      });
    }

    subtask.title = title.trim();

    await task.save();

    res.status(200).json({
      message: "Subtask updated successfully",
      task
    });
  } catch (error) {
    console.error("Update subtask error:", error);

    res.status(500).json({
      message: "Server error while updating subtask"
    });
  }
};

module.exports = {
  addSubtask,
  toggleSubtask,
  deleteSubtask,
  updateSubtask
};