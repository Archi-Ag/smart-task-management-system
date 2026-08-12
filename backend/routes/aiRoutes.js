const express = require("express");

const router = express.Router();

const { generateTask } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

router.post("/generate", protect, generateTask);

module.exports = router;