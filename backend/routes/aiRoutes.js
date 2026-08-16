const express = require("express");

const router = express.Router();

const {
  generateTask,
  generateTaskSummary
} = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

router.post(
  "/summary",
  protect,
  generateTaskSummary
);
router.post("/generate", protect, generateTask);

module.exports = router;