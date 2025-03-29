const express = require("express");
const router = express.Router();
const { createJob, getAllJobs, getJobById, updateJob, deleteJob } = require("../controllers/jobsController");
const authMiddleware = require("../middleware/authMiddleware");

// Public Routes
router.get("/", getAllJobs);
router.get("/:id", getJobById);

// Protected Routes (Only Employers)
router.post("/", authMiddleware, createJob);
router.put("/:id", authMiddleware, updateJob);
router.delete("/:id", authMiddleware, deleteJob);

module.exports = router;
