const express = require("express");

const {
  addSubtask,
  toggleSubtask,
  deleteSubtask,
  updateSubtask
} = require("../controllers/subtaskController");

const {protect} = require("../middleware/authMiddleware");

const router = express.Router();

// Add subtask
router.post("/:taskId", protect, addSubtask);

// Toggle subtask
router.patch("/:taskId/:subtaskId", protect, toggleSubtask);

// Edit subtask
router.patch("/:taskId/:subtaskId/edit", protect, updateSubtask);

// Delete subtask
router.delete("/:taskId/:subtaskId", protect, deleteSubtask);

module.exports = router;